import _ from 'lodash';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { tryLogin } from '../auth';
import requiresAuth from '../permissions';

const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.Sequelize.ValidationError) {
    //  _.pick({a: 1, b: 2}, 'a') => {a: 1}
    return e.errors.map((x) => _.pick(x, ['path', 'message']));
  }
  return [{ path: 'name', message: 'something went wrong' }];
};

const pubsub = new PubSub();
const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

export default {
  Subscription: {
    newChannelMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        (payload, args) => {
          return payload.channelId === args.channelId;
        }
      ),
    },
  },

  Query: {
    // user
    user: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    
    allUsers: (parent, args, { models }) => models.User.findAll(),

    // team
    myTeams: requiresAuth.createResolver((parent, args, { models, user }) =>
      models.Team.findAll({ where: { owner: user.id } }, { raw: true })
    ),

    invitedToTeams: requiresAuth.createResolver(
      (parent, args, { models, user }) =>
        models.sequelize.query(
          'select * from teams join members on id = team_id where user_id = ?',
          { replacements: [user.id], model: models.Team }
        )
    ),

    // message
    // prettier-ignore
    messages: requiresAuth.createResolver( async (parent, { channelId }, { models }) =>
      await models.Message.findAll({ order: [['created_at', 'ASC']], where: { channelId } }, { raw: true })
    )
  },

  Mutation: {
    // user
    login: (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      tryLogin(email, password, models, SECRET, SECRET2),

    register: async (parent, args, { models }) => {
      try {
        const user = await models.User.create(args);
        return {
          ok: true,
          user,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    },

    // team
    createTeam: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          const response = await models.sequelize.transaction(async () => {
            const team = await models.Team.create({ ...args, owner: user.id });
            await models.Channel.bulkCreate([
              { name: 'general', public: true, teamId: team.id },
              { name: 'random', public: true, teamId: team.id },
            ]);
            return team;
          });

          return {
            ok: true,
            team: response,
          };
        } catch (err) {
          console.log(err);
          return {
            ok: false,
            errors: formatErrors(err, models),
          };
        }
      }
    ),

    addTeamMember: requiresAuth.createResolver(
      async (parent, { email, teamId }, { models, user }) => {
        try {
          const teamPromise = models.Team.findOne(
            { where: { id: teamId } },
            { raw: true }
          );

          const userToAddPromise = models.User.findOne(
            { where: { email } },
            { raw: true }
          );

          const [team, userToAdd] = await Promise.all([
            teamPromise,
            userToAddPromise,
          ]);

          if (team.owner !== user.id) {
            return {
              ok: false,
              errors: [
                {
                  path: 'email',
                  message: 'You can not add members to the team',
                },
              ],
            };
          }

          if (!userToAdd) {
            return {
              ok: false,
              errors: [
                {
                  path: 'email',
                  message: 'Could not find user with this email',
                },
              ],
            };
          }

          await models.Member.create({ userId: userToAdd.id, teamId });
          return {
            ok: true,
          };
        } catch (err) {
          console.log(err);
          return {
            ok: false,
            errors: formatErrors(err, models),
          };
        }
      }
    ),

    // channel
    createChannel: requiresAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          const team = await models.Team.findOne(
            { where: { id: args.teamId } },
            { raw: true }
          );
          if (team.owner !== user.id) {
            return {
              ok: false,
              errors: [
                {
                  path: 'name',
                  message: 'You need to be the owner to create Channels',
                },
              ],
            };
          }
          const channel = await models.Channel.create(args);
          return {
            ok: true,
            channel,
          };
        } catch (err) {
          console.log(err);
          return {
            ok: false,
            errors: formatErrors(err, models),
          };
        }
      }
    ),

    // message
    // prettier-ignore
    createMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
        try {
          const message = await models.Message.create({
            ...args,
            userId: user.id,
          });

          const currentUser = await models.User.findOne({
            where: {
              id: user.id
            }
          })

          pubsub.publish(NEW_CHANNEL_MESSAGE, { 
            channelId: args.channelId, 
            newChannelMessage: message.dataValues,
            user: currentUser.dataValues,
          });

          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      }
    )
  },

  Team: {
    channels: ({ id }, args, { models }) =>
      models.Channel.findAll({ where: { teamId: id } }),
  },

  Message: {
    user: ({ user, userId }, args, { models }) => {
      if (user) {
        return user;
      }
      return models.User.findOne({ where: { id: userId } }, { raw: true });
    },
  },
};
