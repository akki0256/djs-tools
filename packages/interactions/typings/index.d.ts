import {
	Awaitable,
	ButtonInteraction,
	ChatInputApplicationCommandData,
	ChatInputCommandInteraction,
	Client,
	Collection,
	InteractionButtonComponentData,
	MessageApplicationCommandData,
	MessageContextMenuCommandInteraction,
	SelectMenuComponentData,
	ModalComponentData,
	ModalSubmitInteraction,
	SelectMenuInteraction,
	Snowflake,
	UserApplicationCommandData,
	UserContextMenuCommandInteraction,
	User
} from 'discord.js';
import fs from 'node:fs';
import { EventEmitter } from 'node:stream';

//#region Classes

export class BaseCommand<T extends CommandInteractionType> extends BaseInteraction<T> {
	#guildId: Snowflake | null;
	#timer: Collection<Snowflake, Date>;
	#coolTime: number;
	public getCoolTime(user: User): Date | null;
	public getLastUseDiff(user: User): number;
	public IsInCoolTime(user: User): boolean;
	public resetCoolTime(user: User): void;

	get coolTime(): number;
	get guildId(): Snowflake | null;
	get timer(): Collection<Snowflake, Date>;
}

export class BaseComponent<T extends ComponentInteractionType> extends BaseInteraction<T> {
}

export class BaseContext<T extends ContextInteractionType> extends BaseCommand<T> {
}

export class Button<T extends 'BUTTON' = 'BUTTON'> extends BaseComponent<T> {
}

export class Command<T extends 'CHAT_INPUT' = 'CHAT_INPUT'> extends BaseCommand<T> {
}

export class DiscordInteractions extends EventEmitter {
	/**
	 * @param client discord client
	 */
	public constructor(client: Client);
	#commands: Interactions['commands'];
	#userContexts: Interactions['userContexts'];
	#messageContexts: Interactions['messageContexts'];
	#buttons: Interactions['buttons'];
	#selectMenus: Interactions['selectMenus'];
	#modals: Interactions['modals'];
	#interactions: Interactions;
	private getAllPath(path: string, predicate?: (value: fs.Dirent) => boolean, pre?: Set<string>): string[];
	private loadInteraction<T extends InteractionTypes>(data: InteractionRegisterData<T>, exec: InteractionRegisterCallback<T>): void;
	/**
	 * Load an interaction file
	 * @param path Path of the directory where it is stored
	 * @param predicate If false, exclude the file
	 */
	public loadInteractions(path: string, predicate?: (value: fs.Dirent) => boolean): void;
	/**
	 * Register the command in the discord
	 * @param guildId Server ID to be registered
	 */
	public registerCommands(guildId?: string): Promise<void>;
	/**
	 * Execute loaded interactions
	 * @param interaction Arguments of the discord interactionCreate event
	 * @param args Other arguments
	 */
	public run<T extends InteractionTypes>(interaction: InteractionData[T][1], ...args: any[]): Promise<any>;

	/**Loaded Slash command */
	get commands(): Interactions['commands'];
	/**Loaded user context */
	get userContexts(): Interactions['userContexts'];
	/**Loaded message context */
	get messageContexts(): Interactions['messageContexts'];
	/**Loaded button interaction */
	get buttons(): Interactions['buttons'];
	/**Loaded selectMenu interaction */
	get selectMenus(): Interactions['selectMenus'];
	/**Loaded modal interaction */
	get modals(): Interactions['modals'];
	/**Loaded all interaction */
	get interactions(): Interactions;

	public on<K extends keyof DiscordInteractionsEvents>(
		event: K,
		listener: (...args: DiscordInteractionsEvents[K]) => Awaitable<void>,
	): this;
	public on<S extends string | symbol>(
		event: Exclude<S, keyof DiscordInteractionsEvents>,
		listener: (...args: any[]) => Awaitable<void>,
	): this;

	public once<K extends keyof DiscordInteractionsEvents>(
		event: K,
		listener: (...args: DiscordInteractionsEvents[K]) => Awaitable<void>,
	): this;
	public once<S extends string | symbol>(
		event: Exclude<S, keyof DiscordInteractionsEvents>,
		listener: (...args: any[]) => Awaitable<void>,
	): this;

	public emit<K extends keyof DiscordInteractionsEvents>(event: K, ...args: DiscordInteractionsEvents[K]): boolean;
	public emit<S extends string | symbol>(event: Exclude<S, keyof DiscordInteractionsEvents>, ...args: unknown[]): boolean;

	public off<K extends keyof DiscordInteractionsEvents>(
		event: K,
		listener: (...args: DiscordInteractionsEvents[K]) => Awaitable<void>,
	): this;
	public off<S extends string | symbol>(
		event: Exclude<S, keyof DiscordInteractionsEvents>,
		listener: (...args: any[]) => Awaitable<void>,
	): this;

	public removeAllListeners<K extends keyof DiscordInteractionsEvents>(event?: K): this;
	public removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof DiscordInteractionsEvents>): this;
}

export class BaseInteraction<T extends InteractionTypes> {
	public constructor(data: InteractionRegisterData<T>, callback: InteractionRegisterCallback<T>);
	#data: InteractionRegisterData<T>;
	#callback: InteractionRegisterCallback<T>;
	public run(interaction: InteractionData[T][1], ...args: any[]): any;

	get data(): InteractionRegisterData<T>;
	get callback(): InteractionRegisterCallback<T>;
}

export class MessageContext<T extends 'MESSAGE' = 'MESSAGE'> extends BaseContext<T> {
}

export class Modal<T extends 'MODAL' = 'MODAL'> extends BaseInteraction<T> {
}

export class SelectMenu<T extends 'SELECT_MENU' = 'SELECT_MENU'> extends BaseComponent<T> {
}

export class UserContext<T extends 'USER' = 'USER'> extends BaseContext<T> {
}

//#endregion

//#region typedef

export interface DiscordInteractionsEvents {
	commandAdd: [command: Command];
	commandEdit: [command: Command];
	error: [error: Error];
	userContextAdd: [command: UserContext];
	userContextEdit: [command: UserContext];
	messageContextAdd: [command: MessageContext];
	messageContextEdit: [command: MessageContext];
	interactionLoaded: [Interaction: Interactions];

}

export interface Interactions {
	commands: Collection<String, Command>,
	userContexts: Collection<String, UserContext>,
	messageContexts: Collection<String, MessageContext>,
	buttons: Collection<String, Button>,
	selectMenus: Collection<String, SelectMenu>,
	modals: Collection<String, Modal>
}

export interface CommandData {
	/**GuildId to register the command */
	guildId?: Snowflake,
	/**Time before the command can be reused */
	coolTime?: number
}

export interface InteractionData {
	'BUTTON': [
		Omit<InteractionButtonComponentData, 'type'>,
		ButtonInteraction,
		Button
	],
	'SELECT_MENU': [
		Omit<SelectMenuComponentData, 'type'>,
		SelectMenuInteraction,
		SelectMenu
	],
	'CHAT_INPUT': [
		Omit<ChatInputApplicationCommandData, 'type'> & CommandData,
		ChatInputCommandInteraction,
		Command
	],
	'MESSAGE': [
		Omit<MessageApplicationCommandData, 'type'> & CommandData,
		MessageContextMenuCommandInteraction,
		MessageContext
	],
	'USER': [
		Omit<UserApplicationCommandData, 'type'> & CommandData,
		UserContextMenuCommandInteraction,
		UserContext
	],
	'MODAL': [
		Omit<ModalComponentData, 'type'>,
		ModalSubmitInteraction,
		Modal
	]
}

export type InteractionTypes = keyof InteractionData;

export type CommandInteractionType = Extract<InteractionTypes, 'CHAT_INPUT' | 'USER' | 'MESSAGE'>;
export type ContextInteractionType = Extract<CommandInteractionType, 'USER' | 'MESSAGE'>;
export type ComponentInteractionType = Extract<InteractionTypes, 'BUTTON' | 'SELECT_MENU'>;

export type InteractionRegisterData<T extends InteractionTypes> = InteractionData[T][0] & { type: T }
export type InteractionRegisterCallback<T extends InteractionTypes> = (interaction: InteractionData[T][1], data: InteractionData[T][2], args?: any[] ) => any;

export interface InteractionRegister<T extends InteractionTypes> {
	data: InteractionRegisterData<T>
	exec: InteractionRegisterCallback<T>
}

export type ButtonRegister<T extends 'BUTTON' = 'BUTTON'> = InteractionRegister<T>
export type SelectMenuRegister<T extends 'SELECT_MENU' = 'SELECT_MENU'> = InteractionRegister<T>
export type ChatInputRegister<T extends 'CHAT_INPUT' = 'CHAT_INPUT'> = InteractionRegister<T>
export type MessageRegister<T extends 'MESSAGE' = 'MESSAGE'> = InteractionRegister<T>
export type UserRegister<T extends 'USER' = 'USER'> = InteractionRegister<T>
export type ModalRegister<T extends 'MODAL' = 'MODAL'> = InteractionRegister<T>

//#endregion