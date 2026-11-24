import { Check, Copy, Globe2, MessageSquare, Send, ThumbsUp } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  createForumPost,
  fetchForumPosts,
  likeForumPost,
  replyToForumPost,
  sendChatMessage,
  subscribeChatRoom,
} from '../lib/firestoreService';
import type { AuthUser, ChatMessage, ForumPost, JlptLevel } from '../types/kotonoha';

interface CommunityViewProps {
  user: AuthUser | null;
  onRequireAuth: () => void;
}

type CommunityTab = 'foro' | 'chat' | 'nativos';

const INVITE_TEMPLATE_JA = `こんにちは！スペイン語を話せるメンバーと、日本語を学んでいるメンバーが「メールアドレス不要・ニックネームだけ」で安心して言語交換できる無料コミュニティ Kotonoha を作りました。15分スペイン語・15分日本語の気軽なチャットや質問交換ができるので、スペイン語に興味がある日本の皆さん、ぜひ遊びに来てください！`;

export function CommunityView({ user, onRequireAuth }: CommunityViewProps) {
  const { t } = useLanguage();
  const cm = t.community;

  const [tab, setTab] = useState<CommunityTab>('foro');

  // Forum state
  const [category, setCategory] = useState<'' | ForumPost['category']>('');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [forumLoading, setForumLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState<ForumPost['category']>('gramatica');
  const [postLevel, setPostLevel] = useState<JlptLevel>('N5');
  const [postContent, setPostContent] = useState('');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [forumError, setForumError] = useState<string | null>(null);
  const [submittingPost, setSubmittingPost] = useState(false);

  // Chat state (real-time Firestore onSnapshot)
  const [room, setRoom] = useState<ChatMessage['room']>('intercambio-es-ja');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatText, setChatText] = useState('');
  const [chatHint, setChatHint] = useState('');
  const [chatError, setChatError] = useState<string | null>(null);
  const [sendingChat, setSendingChat] = useState(false);

  // Invite copy feedback
  const [copiedInvite, setCopiedInvite] = useState(false);

  const forumCategories: { id: '' | ForumPost['category']; label: string }[] = [
    { id: '', label: cm.categories.all },
    { id: 'intercambio', label: cm.categories.intercambio },
    { id: 'gramatica', label: cm.categories.gramatica },
    { id: 'pronunciacion', label: cm.categories.pronunciacion },
    { id: 'cultura', label: cm.categories.cultura },
    { id: 'recursos', label: cm.categories.recursos },
  ];

  const loadForum = useCallback(() => {
    setForumLoading(true);
    setForumError(null);
    fetchForumPosts(category || undefined)
      .then((list) => setPosts(list))
      .catch((err) => setForumError(err instanceof Error ? err.message : t.errors.fallbackMsg))
      .finally(() => setForumLoading(false));
  }, [category, t.errors.fallbackMsg]);

  useEffect(() => {
    if (tab === 'foro') loadForum();
  }, [tab, loadForum]);

  useEffect(() => {
    if (tab !== 'chat') return;
    setChatError(null);
    const unsubscribe = subscribeChatRoom(room, (list) => {
      setMessages(list);
    });
    return () => {
      unsubscribe();
    };
  }, [tab, room]);

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      onRequireAuth();
      return;
    }
    if (postTitle.trim().length < 4 || postContent.trim().length < 8) {
      setForumError(cm.validationTitleBody);
      return;
    }
    setForumError(null);
    setSubmittingPost(true);
    try {
      await createForumPost(user, {
        category: postCategory,
        title: postTitle,
        content: postContent,
        jlptLevel: postLevel,
      });
      setPostTitle('');
      setPostContent('');
      setShowNewPost(false);
      loadForum();
    } catch (err) {
      setForumError(err instanceof Error ? err.message : t.errors.fallbackMsg);
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleReply = async (postId: string) => {
    if (!user) {
      onRequireAuth();
      return;
    }
    const text = (replyDrafts[postId] || '').trim();
    if (text.length < 2) {
      setForumError(cm.validationReply);
      return;
    }
    setForumError(null);
    try {
      await replyToForumPost(user, postId, text);
      setReplyDrafts((prev) => ({ ...prev, [postId]: '' }));
      loadForum();
    } catch (err) {
      setForumError(err instanceof Error ? err.message : t.errors.fallbackMsg);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      onRequireAuth();
      return;
    }
    try {
      await likeForumPost(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p))
      );
    } catch {
      // ignore transient error
    }
  };

  const handleSendChat = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      onRequireAuth();
      return;
    }
    if (!chatText.trim()) return;
    setChatError(null);
    setSendingChat(true);
    try {
      await sendChatMessage(user, {
        room,
        content: chatText.trim(),
        translationHint: chatHint.trim() || undefined,
      });
      setChatText('');
      setChatHint('');
    } catch (err) {
      setChatError(err instanceof Error ? err.message : t.errors.fallbackMsg);
    } finally {
      setSendingChat(false);
    }
  };

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(INVITE_TEMPLATE_JA);
      setCopiedInvite(true);
      window.setTimeout(() => setCopiedInvite(false), 2500);
    } catch {
      // clipboard blocked
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DFD9CD] dark:border-[#262C36] pb-6">
        <div>
          <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{cm.eyebrow}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9] mt-1">
            {cm.title}
          </h1>
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#ECE8DF] dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] self-start">
          {(
            [
              { id: 'foro', label: cm.tabForum },
              { id: 'chat', label: cm.tabChat },
              { id: 'nativos', label: cm.tabNatives },
            ] as { id: CommunityTab; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                tab === item.id
                  ? 'bg-white dark:bg-[#272D38] text-[#C9372C] dark:text-[#E04F44] shadow-xs'
                  : 'text-[#5A606B] dark:text-[#9BA1AE]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: FORUM */}
      {tab === 'foro' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {forumCategories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    category === c.id
                      ? 'border-[#1E3A5F] dark:border-[#7FAEE3] bg-[#1E3A5F]/10 text-[#1E3A5F] dark:text-[#7FAEE3]'
                      : 'border-[#DFD9CD] dark:border-[#262C36] text-[#5A606B] dark:text-[#9BA1AE]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                if (!user) onRequireAuth();
                else setShowNewPost((v) => !v);
              }}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-[#C9372C] hover:bg-[#AE2D23] dark:bg-[#D9463B] text-white cursor-pointer"
            >
              {showNewPost ? cm.cancel : cm.newTopic}
            </button>
          </div>

          {forumError && <p className="text-xs text-[#C9372C] dark:text-[#F06B60]">{forumError}</p>}

          {showNewPost && (
            <form
              onSubmit={handleCreatePost}
              className="p-6 rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  required
                  minLength={4}
                  maxLength={140}
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder={cm.topicTitlePlaceholder}
                  className="sm:col-span-2 rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3.5 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value as ForumPost['category'])}
                    className="rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-2.5 py-2 text-xs text-[#1A1D21] dark:text-[#F2EFE9]"
                  >
                    <option value="gramatica">{cm.categories.gramatica}</option>
                    <option value="pronunciacion">{cm.categories.pronunciacion}</option>
                    <option value="intercambio">{cm.categories.intercambio}</option>
                    <option value="cultura">{cm.categories.cultura}</option>
                    <option value="recursos">{cm.categories.recursos}</option>
                  </select>
                  <select
                    value={postLevel}
                    onChange={(e) => setPostLevel(e.target.value as JlptLevel)}
                    className="rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-2.5 py-2 text-xs text-[#1A1D21] dark:text-[#F2EFE9]"
                  >
                    {(['N5', 'N4', 'N3', 'N2', 'N1'] as JlptLevel[]).map((lv) => (
                      <option key={lv} value={lv}>
                        {lv}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <textarea
                required
                minLength={8}
                maxLength={2500}
                rows={4}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder={cm.topicBodyPlaceholder}
                className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3.5 py-2.5 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
              />
              <button
                type="submit"
                disabled={submittingPost}
                className="px-5 py-2 rounded-lg text-sm font-medium bg-[#1E3A5F] text-white cursor-pointer disabled:opacity-50"
              >
                {submittingPost ? cm.publishing : cm.publishBtn}
              </button>
            </form>
          )}

          {forumLoading ? (
            <p className="py-12 text-center text-sm text-[#5A606B] dark:text-[#9BA1AE]">{cm.loadingPosts}</p>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-8 text-center space-y-2">
              <p className="font-display text-xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
                {cm.emptyCategoryTitle}
              </p>
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{cm.emptyCategorySub}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6 space-y-4"
                >
                  <div className="space-y-1">
                    <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                      {post.authorUsername}
                      {post.authorNativeLang === 'ja' ? ` (${cm.nativeBadge})` : ''}{' '}
                      <span aria-hidden="true">·</span> {cm.categories[post.category] || post.category}{' '}
                      <span aria-hidden="true">·</span> JLPT {post.jlptLevel} <span aria-hidden="true">·</span>{' '}
                      {post.createdAt.slice(0, 10)}
                    </p>
                    <h2 className="font-display text-2xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
                      {post.title}
                    </h2>
                  </div>

                  <p className="text-sm text-[#3B404A] dark:text-[#C4C9D4] whitespace-pre-line leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-5 pt-2 border-t border-[#ECE8DF] dark:border-[#262C36] text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                    <button
                      type="button"
                      onClick={() => handleLike(post.id)}
                      className="inline-flex items-center gap-1.5 hover:text-[#C9372C] transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="font-mono-num">{post.likesCount}</span> {cm.helpfulBtn}
                    </button>
                    <span className="inline-flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="font-mono-num">{post.repliesCount}</span> {cm.repliesLabel}
                    </span>
                  </div>

                  {post.replies && post.replies.length > 0 && (
                    <div className="pl-4 border-l border-[#DFD9CD] dark:border-[#2C323E] space-y-3">
                      {post.replies.map((rep) => (
                        <div key={rep.id} className="text-sm space-y-0.5">
                          <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">
                            <strong className="text-[#1A1D21] dark:text-[#F2EFE9]">{rep.authorUsername}</strong>
                            {rep.authorNativeLang === 'ja' ? ` (${cm.nativeBadge})` : ''} · {rep.createdAt.slice(0, 16)}
                          </p>
                          <p className="text-[#3B404A] dark:text-[#C4C9D4]">{rep.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={replyDrafts[post.id] || ''}
                      onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder={user ? cm.replyPlaceholderSigned : cm.replyPlaceholderGuest}
                      className="flex-1 rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-[#F7F5F0] dark:bg-[#111317] px-3 py-2 text-xs text-[#1A1D21] dark:text-[#F2EFE9]"
                    />
                    <button
                      type="button"
                      onClick={() => handleReply(post.id)}
                      className="px-3.5 py-2 rounded-lg text-xs font-medium bg-[#1E3A5F] text-white cursor-pointer"
                    >
                      {cm.replyBtn}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LIVE CHAT ROOMS */}
      {tab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-4 space-y-2.5">
            <p className="text-xs font-medium text-[#5A606B] dark:text-[#9BA1AE]">{cm.roomsHeading}</p>
            {cm.rooms.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRoom(r.id)}
                className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                  room === r.id
                    ? 'bg-white dark:bg-[#1E232D] border-[#C9372C] dark:border-[#E04F44]'
                    : 'bg-white/70 dark:bg-[#191C22] border-[#DFD9CD] dark:border-[#262C36]'
                }`}
              >
                <p className="text-sm font-medium text-[#1A1D21] dark:text-[#F2EFE9]">{r.label}</p>
                <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-0.5">{r.desc}</p>
              </button>
            ))}
          </aside>

          <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#ECE8DF] dark:border-[#262C36] flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-sm text-[#1A1D21] dark:text-[#F2EFE9]">
                  {cm.roomPrefix} {cm.rooms.find((r) => r.id === room)?.label}
                </h2>
                <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{cm.chatRealtimeSub}</p>
              </div>
              {!user && (
                <button
                  type="button"
                  onClick={onRequireAuth}
                  className="text-xs font-medium text-[#C9372C] dark:text-[#E04F44] underline underline-offset-4 cursor-pointer"
                >
                  {cm.signInToChat}
                </button>
              )}
            </div>

            <div className="p-6 space-y-4 h-[400px] overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{cm.emptyChat}</p>
              ) : (
                messages.map((m) => {
                  const mine = Boolean(user && m.authorUid === user.uid);
                  return (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-xl max-w-[85%] ${
                        mine
                          ? 'ml-auto bg-[#1E3A5F] text-white'
                          : 'bg-[#F7F5F0] dark:bg-[#111317] text-[#1A1D21] dark:text-[#F2EFE9]'
                      }`}
                    >
                      <p
                        className={`text-[11px] mb-1 ${
                          mine ? 'text-white/75' : 'text-[#5A606B] dark:text-[#9BA1AE]'
                        }`}
                      >
                        {m.authorUsername}
                        {m.authorNativeLang === 'ja' ? ` · ${cm.nativeShortBadge}` : ''} · {m.createdAt.slice(11, 16)}
                      </p>
                      <p className="font-jp text-sm leading-relaxed">{m.content}</p>
                      {m.translationHint && (
                        <p
                          className={`text-xs mt-1 pt-1 border-t ${
                            mine
                              ? 'border-white/20 text-white/85'
                              : 'border-[#DFD9CD] dark:border-[#262C36] text-[#5A606B] dark:text-[#9BA1AE]'
                          }`}
                        >
                          {cm.translationPrefix} {m.translationHint}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {chatError && <p className="px-6 pb-2 text-xs text-[#C9372C]">{chatError}</p>}

            <form
              onSubmit={handleSendChat}
              className="p-4 border-t border-[#ECE8DF] dark:border-[#262C36] bg-[#F7F5F0]/60 dark:bg-[#151820] space-y-2"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={600}
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  placeholder={cm.chatInputPlaceholder}
                  className="flex-1 rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-white dark:bg-[#111317] px-3.5 py-2 text-sm text-[#1A1D21] dark:text-[#F2EFE9]"
                />
                <button
                  type="submit"
                  disabled={sendingChat}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#C9372C] hover:bg-[#AE2D23] text-white cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {cm.send}
                </button>
              </div>
              <input
                type="text"
                maxLength={280}
                value={chatHint}
                onChange={(e) => setChatHint(e.target.value)}
                placeholder={cm.chatHintPlaceholder}
                className="w-full rounded-lg border border-[#DFD9CD] dark:border-[#2C323E] bg-white dark:bg-[#111317] px-3.5 py-1.5 text-xs text-[#1A1D21] dark:text-[#F2EFE9]"
              />
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: PLAYBOOK FOR CONNECTING WITH NATIVES */}
      {tab === 'nativos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6 sm:p-8 space-y-6">
            <div>
              <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{cm.playbookEyebrow}</p>
              <h2 className="font-display text-3xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9] mt-1">
                {cm.playbookTitle}
              </h2>
            </div>

            <div className="divide-y divide-[#ECE8DF] dark:divide-[#262C36]">
              {cm.playbookSteps.map((step, i) => (
                <div key={i} className="py-4 space-y-1.5">
                  <h3 className="text-sm font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">{step.title}</h3>
                  <p className="text-sm text-[#4A505A] dark:text-[#B3B8C4] leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#262C36] p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#1E3A5F] dark:text-[#7FAEE3]">
              <Globe2 className="w-5 h-5" />
              <h3 className="font-display text-xl font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
                {cm.inviteCardTitle}
              </h3>
            </div>
            <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE]">{cm.inviteCardSub}</p>
            <div className="p-4 rounded-xl bg-[#F7F5F0] dark:bg-[#111317] font-jp text-sm leading-relaxed text-[#1A1D21] dark:text-[#F2EFE9]">
              {INVITE_TEMPLATE_JA}
            </div>
            <button
              type="button"
              onClick={handleCopyInvite}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium bg-[#1E3A5F] hover:bg-[#162C49] dark:bg-[#4978B0] text-white transition-colors cursor-pointer"
            >
              {copiedInvite ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedInvite ? cm.inviteCopied : cm.inviteCopyBtn}
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
