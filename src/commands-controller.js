const { welcome, addNewStudentRole } = require('./Commands/welcome');
const { nickname } = require('./Commands/nickname');
const { notice } = require('./Commands/notice');
const { sendGrade } = require('./Commands/send-grade');
const { doubtNotification } = require('./Commands/doubt-notification');
const {
  deleteRoles,
  deleteChannels,
  crateRoles,
  createWorkstation,
  addGuildToDB,
} = require('./Commands/start');
const { addAssistant } = require('./Commands/add-assistant');
const { changeTeacher } = require('./Commands/change-teacher');
const Guild = require('./models/guild');

const botCommands = {};

botCommands.memberAdded = (member, Discord) => {
  welcome(member, Discord);
  addNewStudentRole(member);
};

botCommands.start = async (message) => {
  let flag = message.content.includes('-d');

  if (flag == true) {
    await deleteRoles(message);
    await deleteChannels(message);
  }

  await crateRoles(message);
  createWorkstation(message);

  let guild = await findGuild(message);
  if (!guild) {
    await addGuildToDB(message);
  }
};

botCommands.changeNickname = (message) => {
  nickname(message);
};

botCommands.serverNotice = (message, Discord) => {
  notice(message, Discord);
};

botCommands.teacherSendGrade = (message) => {
  sendGrade(message);
};

botCommands.teacherAddAssistant = (message) => {
  addAssistant(message);
};

botCommands.teacherChangeTeacher = (message) => {
  changeTeacher(message);
};

botCommands.studentDoubtNotification = (message) => {
  let doubtChannel;
  try {
    doubtChannel = message.guild.channels.cache.find(
      (channel) => channel.name == '🔎-doubts'
    );
  } catch (e) {}

  try {
    if (message.channel.id === doubtChannel.id) {
      doubtNotification(message);
    }
  } catch {}
};

module.exports = botCommands;

const findGuild = async (message) => {
  let name = message.guild.name;
  let teacherRole = message.guild.roles.cache.find(
    (role) => role.name == 'Teacher'
  );
  let professor = teacherRole.members.first().user.username;

  const guild = await Guild.findOne({ name, professor });
  return guild;
};
