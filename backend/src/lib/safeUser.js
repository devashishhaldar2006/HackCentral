export const getSafeUserData = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  
  return {
    _id: obj._id,
    fullName: obj.fullName,
    email: obj.email,
    authProvider: obj.authProvider,
    gender: obj.gender,
    avatar: obj.avatar,
    college: obj.college,
    location: obj.location,
    skills: obj.skills,
    interests: obj.interests,
    github: obj.github,
    linkedin: obj.linkedin,
    role: obj.role,
    bookmarkedEvents: obj.bookmarkedEvents,
    registeredEvents: obj.registeredEvents,
    website: obj.website,
    verified: obj.verified,
    submittedEvents: obj.submittedEvents,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};
