subscriptions = {
  _id: ObjectId,

  userId: ObjectId,

  plan: "free" | "pro" | "enterprise",

  status: "active" | "trial" | "expired" | "cancelled",

  limits: {
    apiCalls: Number,
    storage: Number,
    toolsAccess: [String]
  },

  validTill: Date,

  createdAt: Date
}