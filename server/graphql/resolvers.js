import _ from 'lodash';
import { tryLogin } from '../auth';
import requiresAuth from '../permissions';

const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.Sequelize.ValidationError) {
    //  _.pick({a: 1, b: 2}, 'a') => {a: 1}
    return e.errors.map((x) => _.pick(x, ['path', 'message']));
  }
  return [{ path: 'name', message: 'something went wrong' }];
};

export default {
  Query: {
    // user
    user: (parent, { id }, { models }) =>
      models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),

    // team
    myTeams: requiresAuth.createResolver((parent, args, { models, user }) =>
      models.Team.findAll({ where: { owner: user.id } }, { raw: true })
    ),

    invitedToTeams: requiresAuth.createResolver(
      (parent, args, { models, user }) =>
        models.Team.findAll(
          {
            include: [
              {
                model: models.User,
                where: { id: user.id },
              },
            ],
          },
          { raw: true }
        )
    ),
  },

  Team: {
    channels: ({ id }, args, { models }) =>
      models.Channel.findAll({ where: { teamId: id } }),
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
    createChannel: async (parent, args, { models }) => {
      try {
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
    },

    // message
    createMessage: async (parent, args, { models, user }) => {
      try {
        await models.Message.create({ ...args, userId: user.id });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};
