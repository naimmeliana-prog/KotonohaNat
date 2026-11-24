# Especificación de Seguridad Firestore — Kotonoha

## 1. Invariantes de Datos
1. **Aislamiento de usuario**: Ningún usuario puede leer, listar, crear o modificar documentos en `/users/{userId}`, `/users/{userId}/srsCards`, `/users/{userId}/studyLogs` o `/users/{userId}/unitCompletions` si `request.auth.uid != userId` (salvo administrador verificado).
2. **Prevención de auto-ascenso**: Un usuario nunca puede crear o actualizar su perfil `/users/{userId}` con `role: 'admin'`, ni inyectar XP arbitrario al crear.
3. **Integridad de autoría y esquema**: Todo hilo de foro, respuesta, mensaje de chat, reto diario o respuesta de intercambio debe validar `authorUid == request.auth.uid`, tipos de datos y límites de longitud en todos los campos de texto y listas (incluidos los 3 intereses en `/users/{userId}`).
4. **Master Gate en subcolecciones**: Una respuesta en `/forumPosts/{postId}/replies/{replyId}` o una corrección en `/responses/{responseId}/corrections/{correctionId}` exige que el documento padre exista y obliga actualización atómica del contador (`repliesCount` / `correctionsCount`).
5. **Contenido curricular protegido**: Solo el administrador verificado (`faridmazari@gmail.com` con `email_verified == true` o documento en `/admins/{uid}`) puede crear, editar o eliminar `/lessons` y `/dictionaryEntries`.
6. **Integridad temporal**: `createdAt` y `updatedAt` se validan estrictamente contra `request.time`.

## 2. "Dirty Dozen" — 12 Payloads Maliciosos Esperados como `PERMISSION_DENIED`
1. Crear `/users/otro_uid` estando autenticado como `uid_A` (Identity Spoofing).
2. Crear `/users/uid_A` con `role: "admin"` (Privilege Escalation).
3. Actualizar `/users/uid_A` añadiendo un campo fantasma `isVerified: true` o `interests` con >3 elementos (Shadow Update / Array Overflow).
4. Listar `/users` sin filtro de propiedad como usuario normal (Query Scraping).
5. Crear `/lessons/hack` sin ser administrador (Unauthorized Curriculum Write).
6. Crear `/dictionaryEntries/hack` con `word` de 5000 caracteres (Denial of Wallet / Size Poisoning).
7. Crear `/forumPosts/bad` o `/responses/bad` con `authorUid` de otro usuario (Author Spoofing).
8. Actualizar `/forumPosts/post1` o `/responses/resp1` de otro usuario cambiando `content` (Unauthorized Content Tampering).
9. Actualizar `/forumPosts/post1` o `/responses/resp1` incrementando `likesCount` o `correctionsCount` en +500 en lugar de +1 (Counter Manipulation).
10. Crear `/forumPosts/inexistente/replies/r1` o `/responses/inexistente/corrections/c1` (Orphaned Subcollection Write).
11. Crear `/chatMessages/m1` con `room: "sala-privada-inventada"` o `/responses/r1` con `targetLang: "fr"` (Enum/Schema Bypass).
12. Acceder como admin usando un correo spoofeado donde `email_verified` es `false` (Email Spoofing Attack).
