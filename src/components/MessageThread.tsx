type ThreadMessage = {
  id: string;
  sender: "TEILNEHMER" | "BETREUER";
  body: string;
  createdAt: Date;
};

export function MessageThread({
  messages,
  viewerRole,
}: {
  messages: ThreadMessage[];
  viewerRole: "TEILNEHMER" | "BETREUER";
}) {
  if (messages.length === 0) {
    return (
      <p className="px-6 py-8 text-center text-sm text-stone-500">
        Noch keine Nachrichten. Schreib die erste Nachricht unten.
      </p>
    );
  }

  return (
    <ul className="space-y-3 p-6">
      {messages.map((m) => {
        const isOwn = m.sender === viewerRole;
        return (
          <li
            key={m.id}
            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                isOwn
                  ? "bg-teal-700 text-white"
                  : "bg-stone-100 text-stone-800"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.body}</p>
              <p
                className={`mt-1 text-[11px] ${
                  isOwn ? "text-teal-100" : "text-stone-400"
                }`}
              >
                {new Intl.DateTimeFormat("de-DE", {
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(m.createdAt)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
