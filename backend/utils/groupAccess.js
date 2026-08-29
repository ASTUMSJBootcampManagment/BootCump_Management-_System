const Batch = require("../models/Batches");

async function getActiveBatch() {
  return Batch.findOne({ status: "Active" });
}

function groupContains(group, field, userId) {
  return (group?.[field] || []).some((id) => String(id) === String(userId));
}

async function getMentorGroups(mentorId) {
  const batch = await getActiveBatch();
  if (!batch) return { batch: null, groups: [] };
  const groups = batch.groups.filter((group) => groupContains(group, "mentors", mentorId));
  // Backwards compatibility for an existing active batch that has not yet been divided into groups.
  if (!batch.groups.length && groupContains(batch, "mentors", mentorId)) {
    return { batch, groups: [{ _id: null, name: "All students", students: batch.students, mentors: batch.mentors }] };
  }
  return { batch, groups };
}

async function mentorCanAccessStudent(mentorId, studentId) {
  const { groups } = await getMentorGroups(mentorId);
  return groups.some((group) => groupContains(group, "students", studentId));
}

module.exports = { getActiveBatch, getMentorGroups, mentorCanAccessStudent, groupContains };
