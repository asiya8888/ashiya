type ConsequenceScreenProps = {
  message: string;
};

export function ConsequenceScreen({ message }: ConsequenceScreenProps) {
  return (
    <section className="consequence-screen" aria-live="assertive">
      <div className="consequence-copy">
        <span className="consequence-line" aria-hidden="true" />
        <p>{message}</p>
        <small>The night continues.</small>
      </div>
    </section>
  );
}
