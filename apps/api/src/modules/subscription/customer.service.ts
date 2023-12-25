import { db } from 'modules/db'
import { stripeInstance } from './stripe'

type CreateCustomer = {
  email: string
  username: string
  discordId: string
}

class CustomerService {
  async getCustomer(customerId: string) {
    try {
      return await stripeInstance.customers.retrieve(customerId)
    } catch (error) {
      return null
    }
  }

  async createCustomer(customer: CreateCustomer) {
    const createdCustomer = await stripeInstance.customers.create({
      email: customer.email,
      metadata: {
        username: customer.username,
        discordId: customer.discordId,
      },
    })

    await db.exec('UPDATE users SET customer_id = $1 WHERE discord_id = $2', [
      createdCustomer.id,
      customer.discordId,
    ])

    return createdCustomer
  }

  async createOrGetCustomer(
    customerId: string | null,
    customerDto: CreateCustomer
  ) {
    if (!customerId) {
      return this.createCustomer(customerDto)
    }
    const customer = await this.getCustomer(customerId)

    if (!customer) {
      return this.createCustomer(customerDto)
    }

    return customer
  }
}

export const customerService = new CustomerService()
