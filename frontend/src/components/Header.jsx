export default function Header({ headerTitle }) {
    return (
      <header className="header">
        <div className="header-row">
          <h1 className="header-title">{headerTitle}</h1>
        </div>
      </header>
    )
}