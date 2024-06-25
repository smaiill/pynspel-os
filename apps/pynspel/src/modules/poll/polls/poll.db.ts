import { GuildPoll } from '@pynspel/common'
import { db } from 'db'

type PollAdd = {
  poll: GuildPoll
  userId: string
  choice: string
}

export class PollsDB {
  public async add(payload: PollAdd) {
    return db.exec(
      'INSERT INTO polls_voters (user_id, poll_id, choice) VALUES ($1, $2, $3)',
      [payload.userId, payload.poll.id, [payload.choice]]
    )
  }

  public async edit(payload: PollAdd) {
    if (payload.poll.allow_multiple) {
      return db.exec(
        `UPDATE polls_voters SET choice = CASE
                WHEN $1 = ANY(choice) THEN choice
                ELSE ARRAY_APPEND(choice, $1)
             END WHERE user_id = $2 AND poll_id = $3`,
        [payload.choice, payload.userId, payload.poll.id]
      )
    }
    return db.exec(
      'UPDATE polls_voters SET choice = $1 WHERE user_id = $2 AND poll_id = $3',
      [[payload.choice], payload.userId, payload.poll.id]
    )
  }

  public async exists(payload: Pick<PollAdd, 'poll' | 'userId'>) {
    const [response] = await db.exec(
      'SELECT choice FROM polls_voters WHERE user_id = $1 AND poll_id = $2 LIMIT 1',
      [payload.userId, payload.poll.id]
    )

    return !!response
  }

  public async addOrEdit(payload: PollAdd) {
    const exists = await this.exists({
      poll: payload.poll,
      userId: payload.userId,
    })

    if (!exists) {
      return this.add(payload)
    }

    return this.edit(payload)
  }

  public async deletePollForUser(pollId: string, userId: string) {
    return db.exec(
      'DELETE FROM polls_voters WHERE user_id = $1 AND poll_id = $2',
      [userId, pollId]
    )
  }
}
