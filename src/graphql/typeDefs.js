export const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    name: String!
    email: String!
    accountType: String!
    role: String!
    createdAt: String!
  }

  type Account {
  id: ID!
  name: String!
  currency: String!
  balance: Float!
  createdAt: String!
  frozen: Boolean
  frozenReason: String
}

  type Transaction {
  id: ID!
  account: ID!
  type: String!
  category: String!
  amount: Float!
  description: String!
  occurredAt: String!
  frozen: Boolean
  createdAt: String!
}

  type AuthPayload {
    user: User!
  }

  type Query {
    ping: String!
    me: User
    accounts: [Account!]!
    account(id: ID!): Account
    transactions(accountId: ID!): [Transaction!]!
    notifications: [Notification!]!
    myTickets: [SupportTicket!]!

    adminUsers(search: String): [AdminUser!]!
    adminUser(id: ID!): AdminUser
    adminUserTransactions(userId: ID!): [Transaction!]!
    adminTickets: [SupportTicket!]!
    auditLog: [AuditEntry!]!
    adminUserNotifications(userId: ID!): [Notification!]!
  }

  input SignUpInput {
    name: String!
    email: String!
    password: String!
    accountType: String
  }

  input LogInInput {
    email: String!
    password: String!
  }

  input CreateTransactionInput {
    accountId: ID!
    type: String!
    category: String
    amount: Float!
    description: String
  }

  type Mutation {
    signUp(input: SignUpInput!): AuthPayload!
    logIn(input: LogInInput!): AuthPayload!
    logOut: Boolean!
    createTransaction(input: CreateTransactionInput!): Transaction!
    createAccount(name: String): Account!
    updateProfile(name: String!): User!
    changePassword(currentPassword: String!, newPassword: String!): Boolean!
    sendMoney(input: SendMoneyInput!): Boolean!
    markNotificationsRead: Boolean!
    createSupportTicket(subject: String!, category: String!, message: String!): SupportTicket!

    adminSetFrozen(accountId: ID!, frozen: Boolean!, reason: String!): Account!
    adminSeedBalance(accountId: ID!, amount: Float!, note: String): Account!
    adminIssueCard(userId: ID!, name: String!): Account!
    adminSetTicketStatus(ticketId: ID!, status: String!): SupportTicket!

    adminSetBalance(accountId: ID!, target: Float!, note: String): Account!

    adminCreateTransaction(accountId: ID!, type: String!, category: String, amount: Float!, description: String, occurredAt: String): Transaction!
    adminEditTransaction(transactionId: ID!, type: String, category: String, amount: Float, description: String, occurredAt: String): Transaction!
    adminDeleteTransaction(transactionId: ID!): Boolean!
    adminSetTransactionFrozen(transactionId: ID!, frozen: Boolean!, reason: String!): Transaction!

    

    adminSendNotification(userId: ID!, message: String!): Boolean!
adminEditNotification(notificationId: ID!, message: String!): Notification!
adminDeleteNotification(notificationId: ID!): Boolean!
  }

  input SendMoneyInput {
    fromAccountId: ID!
    toEmail: String!
    amount: Float!
  }
    type Notification {
    id: ID!
    message: String!
    read: Boolean!
    createdAt: String!
  }

  
  
type SupportTicket {
    id: ID!
    reference: String!
    subject: String!
    category: String!
    message: String!
    status: String!
    createdAt: String!
  }
    type AdminUser {
    id: ID!
    name: String!
    email: String!
    accountType: String!
    role: String!
    createdAt: String!
    accounts: [Account!]!
    totalBalance: Float!
  }

  type AuditEntry {
    id: ID!
    adminName: String!
    action: String!
    details: String!
    createdAt: String!
  }
`;