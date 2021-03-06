const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategory = require('../../enums/TypeReaderCategory.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const TypeReaderUtil = require('../../utility/TypeReaderUtil.js');
const Constants = require('../../utility/Constants.js');

class BannedUserTypeReader extends TypeReader {
  constructor() {
    super({ type: 'banneduser' });

    this.category = TypeReaderCategory.Library;
  }

  async read(command, message, argument, args, input) {
    const bans = await message.guild.fetchBans();

    if (Constants.regexes.userMention.test(input) === true || Constants.regexes.id.test(input) === true) {
      const user = bans.get(input.match(Constants.regexes.findId)[0]);

      if (user !== undefined) {
        return TypeReaderResult.fromSuccess(user);
      }

      return TypeReaderResult.fromError(command, Constants.errors.bannedUserNotFound);
    }

    const lowerInput = input.toLowerCase();

    if (Constants.regexes.usernameAndDiscrim.test(input) === true) {
      const user = bans.findValue((v) => v.tag.toLowerCase() === lowerInput);

      if (user !== undefined) {
        return TypeReaderResult.fromSuccess(user);
      }

      return TypeReaderResult.fromError(command, Constants.errors.bannedUserNotFound);
    }

    const matches = bans.filterValues((v) => v.username.toLowerCase().includes(lowerInput));

    return TypeReaderUtil.handleMatches(command, matches, 'bannedUserNotFound', 'tag');
  }
}

module.exports = new BannedUserTypeReader();
