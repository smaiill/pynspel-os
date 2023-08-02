import { Client, ClientEvents } from 'discord.js'

type Events = keyof ClientEvents

export interface EventClass<E extends Events = Events> {
  _eventName: E
  on(client: Client, ...args: [...ClientEvents[E]]): Promise<void> | void
}

export interface EventAbstractClass<E extends Events, A extends unknown[]> {
  _eventName: E
  on(client: Client, ...args: A): Promise<void> | void
}

export abstract class BaseEvent<
  E extends Events,
  A extends unknown[] = [...ClientEvents[E]]
> implements EventAbstractClass<E, A>
{
  _eventName: E

  constructor(name: E) {
    this._eventName = name
  }

  abstract on(...args: [Client, ...A]): Promise<void> | void
}
