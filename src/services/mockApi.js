// Демо-данные для просмотра личного кабинета без бэкенда.
// Включается переменной REACT_APP_MOCK=teacher, student или user (см. api.js)

const wait = (data) => new Promise((resolve) => setTimeout(() => resolve(data), 300));

const makeStudents = (names) =>
  names.map(([lastName, firstName], i) => ({
    id: 1000 + i,
    lastName,
    firstName,
    scores: Array.from({ length: 11 }, (_, level) => 10 - ((i + level) % 4))
  }));

const groups = [
  {
    id: 1,
    name: 'ДКИП-301',
    organization: 'Синергия',
    inviteCode: 'demo301',
    students: makeStudents([['Пролеев', 'Георгий'], ['Иванова', 'Анна'], ['Смирнов', 'Пётр']])
  },
  {
    id: 2,
    name: 'ДКИП-302',
    organization: 'Синергия',
    inviteCode: 'demo302',
    students: makeStudents([['Кузнецова', 'Мария'], ['Петров', 'Илья']])
  }
];

const verificationRequests = [];

const myScores = [10, 9, 8, 10, 7, 9, null, null, null, null, null];

const findGroup = (id) => {
  const group = groups.find((g) => String(g.id) === String(id));
  if (!group) throw new Error('Группа не найдена');
  return group;
};

export const createMockApi = (role) => ({
  getProfile: () =>
    wait({
      id: '79124674016',
      firstName: 'Георгий',
      lastName: 'Пролеев',
      middleName: 'Николаевич',
      email: 'demo@example.com',
      nickname: null,
      emailConfirmed: true,
      role: role === 'teacher' ? 'TEACHER' : role === 'user' ? 'USER' : 'STUDENT'
    }),

  getVerificationStatus: () => wait([...verificationRequests]),

  requestStudentStatus: () => {
    verificationRequests.unshift({ id: Date.now(), requestType: 'STUDENT', status: 'PENDING', comment: null });
    return wait({});
  },

  requestTeacherStatus: () => {
    verificationRequests.unshift({ id: Date.now(), requestType: 'TEACHER', status: 'PENDING', comment: null });
    return wait({ message: 'Заявка отправлена на рассмотрение' });
  },

  getGroups: () =>
    wait(groups.map(({ students, ...g }) => ({ ...g, studentsCount: students.length }))),

  createGroup: (name, organization) => {
    const group = { id: Date.now(), name, organization, inviteCode: `demo${Date.now()}`, students: [] };
    groups.push(group);
    return wait(group);
  },

  getGroup: (id) => wait({ ...findGroup(id) }),

  updateGroup: (id, name, organization) => wait(Object.assign(findGroup(id), { name, organization })),

  addStudentToGroup: (groupId, studentId) => {
    const group = findGroup(groupId);
    group.students = [
      ...group.students,
      { id: studentId, lastName: 'Студент', firstName: `№${studentId}`, scores: [] }
    ];
    return wait({});
  },

  removeStudentFromGroup: (groupId, studentId) => {
    const group = findGroup(groupId);
    group.students = group.students.filter((s) => String(s.id) !== String(studentId));
    return wait({});
  },

  getMyGroups: () =>
    wait([
      {
        id: 1,
        name: 'ДКИП-301',
        organization: 'Синергия',
        teacher: { lastName: 'Соколова', firstName: 'Елена', middleName: 'Викторовна' }
      }
    ]),

  getMyScores: () => wait([...myScores]),

  saveLevelResult: (level, score) => {
    myScores[level] = Math.max(myScores[level] ?? 0, score);
    return wait([...myScores]);
  },

  joinGroup: () =>
    wait({
      id: 1,
      name: 'ДКИП-301',
      organization: 'Синергия',
      teacher: { lastName: 'Соколова', firstName: 'Елена', middleName: 'Викторовна' }
    })
});
