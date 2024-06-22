import { GuildPool } from '@pynspel/common'
import { db } from 'db'

type PoolAdd = {
  pool: GuildPool
  userId: string
  choice: string
}

export class PoolsDB {
  public async add(payload: PoolAdd) {
    return db.exec(
      'INSERT INTO pools_voters (user_id, pool_id, choice) VALUES ($1, $2, $3)',
      [payload.userId, payload.pool.id, [payload.choice]]
    )
  }

  public async edit(payload: PoolAdd) {
    if (payload.pool.allow_multiple) {
      return db.exec(
        `UPDATE pools_voters SET choice = CASE
                WHEN $1 = ANY(choice) THEN choice
                ELSE ARRAY_APPEND(choice, $1)
             END WHERE user_id = $2 AND pool_id = $3`,
        [payload.choice, payload.userId, payload.pool.id]
      )
    }
    return db.exec(
      'UPDATE pools_voters SET choice = $1 WHERE user_id = $2 AND pool_id = $3',
      [[payload.choice], payload.userId, payload.pool.id]
    )
  }

  public async exists(payload: Pick<PoolAdd, 'pool' | 'userId'>) {
    const [response] = await db.exec(
      'SELECT choice FROM pools_voters WHERE user_id = $1 AND pool_id = $2 LIMIT 1',
      [payload.userId, payload.pool.id]
    )

    return !!response
  }

  public async addOrEdit(payload: PoolAdd) {
    const exists = await this.exists({
      pool: payload.pool,
      userId: payload.userId,
    })

    if (!exists) {
      return this.add(payload)
    }

    return this.edit(payload)
  }

  public async deletePoolForUser(poolId: string, userId: string) {
    return db.exec(
      'DELETE FROM pools_voters WHERE user_id = $1 AND pool_id = $2',
      [userId, poolId]
    )
  }
}
