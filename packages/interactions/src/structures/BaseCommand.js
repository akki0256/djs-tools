const { Collection } = require('discord.js');
const BaseInteraction = require('./BaseInteraction');

class BaseCommand extends BaseInteraction {
	/**@type {number} */
	#coolTime;
	/**@type {Snowflake?} */
	#guildId;
	/**@type {Collection<GuildMember,Date>} */
	#timer;
	constructor(data, callback) {
		super(data, callback);

		this.#coolTime = data.coolTime ?? 0;
		this.#guildId = data.guildId || null;
		this.#timer = new Collection();
	}

	get coolTime() {
		return this.#coolTime;
	}

	get guildId() {
		return this.#guildId;
	}

	get timer() {
		return this.#timer.clone();
	}

	isInCoolTime(member) {
		if (!this.timer.has(member)) return false;
		const lastTime = this.timer.get(member).getTime();
		const nowTime = Date.now();
		return !((lastTime + this.coolTime) <= nowTime);
	}

	run(interaction) {
		this.#timer.set(interaction.member, new Date());
		return this.callback(interaction);
	}
}

module.exports = BaseCommand;
