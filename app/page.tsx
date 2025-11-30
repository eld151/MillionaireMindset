export default function Home() {
  return (
    <main className="flex">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <Navbar />

        <section className="mt-8">
          {/*News Section */}
        </section>

        <section className="mt-12">
          {/*Story previews */}
        </section>
      </div>

      <RightBar /> {/*stock list and login*/}
    </main> 
    );
}

const Sidebar = () => {
  return (
    <aside className="w-56 border -r h-screen p-4">
      <ul className="space-y-4">
        <li>Lessons</li>
        <li>Calculators</li>
        <li>Connect</li>
        <li>Market</li>
        <li>Quizzes</li>
        <li>Games</li>
      </ul>
    </aside>
  )
}

const Navbar = () => {
    return (
      null
    ) 
}

const RightBar = () => {
  return (
    null
  )
}