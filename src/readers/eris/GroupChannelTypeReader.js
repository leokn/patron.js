const DiscordChannelType = require('../../enums/DiscordChannelType.js');
const TypeReader = require('../../structures/TypeReader.js');
const TypeReaderCategory = require('../../enums/TypeReaderCategory.js');
const TypeReaderResult = require('../../results/TypeReaderResult.js');
const TypeReaderUtil = require('../../utility/TypeReaderUtil.js');
const Constants = require('../../utility/Constants.js');

class GroupChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'groupchannel' });

    this.category = TypeReaderCategory.Library;
  }

  async read(command, message, argument, args, input) {
    if (Constants.regexes.id.test(input) === true) {
      const channel = message._client.channels.find((c) => c.id === input.match(Constants.regexes.findId)[0]);

      if (channel !== undefined && channel.type === DiscordChannelType.GroupDM) {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    const lowerInput = input.toLowerCase();

    const matches = message._client.channels.filter((v) => v.name !== undefined && v.name.toLowerCase().includes(lowerInput) && v.type === DiscordChannelType.GroupChannel);

    return TypeReaderUtil.handleMatches(command, matches, 'groupChannelNotFound');
  }
}

module.exports = new GroupChannelTypeReader();
