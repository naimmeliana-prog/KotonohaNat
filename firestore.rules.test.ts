// Payload-first security test specification for Firestore Security Rules (Eight Pillars)
// Validates that all Dirty Dozen adversarial payloads are rejected with PERMISSION_DENIED.

export const DIRTY_DOZEN_CASES = [
  { id: 1, name: 'Identity Spoofing on /users/{otherUid}', path: '/users/victim_uid', expected: 'PERMISSION_DENIED' },
  { id: 2, name: 'Self-Assigned Admin Role on /users/{uid}', payload: { role: 'admin' }, expected: 'PERMISSION_DENIED' },
  { id: 3, name: 'Shadow Update or >3 Interests Overflow on /users/{uid}', payload: { isVerified: true, interests: ['a', 'b', 'c', 'd'] }, expected: 'PERMISSION_DENIED' },
  { id: 4, name: 'Unscoped List Query on /users', path: '/users', expected: 'PERMISSION_DENIED' },
  { id: 5, name: 'Non-Admin Lesson Creation', path: '/lessons/lesson_x', expected: 'PERMISSION_DENIED' },
  { id: 6, name: 'Oversized String Resource Poisoning on /dictionaryEntries', payloadLen: 5000, expected: 'PERMISSION_DENIED' },
  { id: 7, name: 'Author UID Spoofing on /forumPosts & /responses', payload: { authorUid: 'victim_uid' }, expected: 'PERMISSION_DENIED' },
  { id: 8, name: 'Unauthorized Edit of Another User Forum Post or Exchange Response', path: '/responses/resp_1', expected: 'PERMISSION_DENIED' },
  { id: 9, name: 'Arbitrary Counter Jump (+500) on /forumPosts & /responses', payload: { correctionsCount: 501 }, expected: 'PERMISSION_DENIED' },
  { id: 10, name: 'Orphaned Reply/Correction on Missing Parent Doc', path: '/responses/missing_resp/corrections/c1', expected: 'PERMISSION_DENIED' },
  { id: 11, name: 'Invalid Room/TargetLang Enum on /chatMessages or /responses', payload: { targetLang: 'fr' }, expected: 'PERMISSION_DENIED' },
  { id: 12, name: 'Unverified Admin Email Spoof', auth: { email: 'faridmazari@gmail.com', email_verified: false }, expected: 'PERMISSION_DENIED' },
] as const;
