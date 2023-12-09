type GuildMemberAddedStatistic = {
  guildId: string
  memberId: string
  joinedAt: Date
}
export class StatisticsService {
  public async guildMemberAdded(info: GuildMemberAddedStatistic) {
    console.log(info)
    console.log('Hello world !')
  }
}

export const statisticsService = new StatisticsService()
