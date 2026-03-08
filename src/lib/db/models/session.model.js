sessions = {
  _id: ObjectId,

  userId: ObjectId,

  refreshToken: String,

  userAgent: String,
  ipAddress: String,

  expiresAt: Date,
  createdAt: Date
}