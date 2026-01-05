import Link from 'next/link';
import { BookOpen, Calculator, Users, Brain, Gamepad2, DollarSign } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { name: 'Lessons', icon: BookOpen, path: '/lessons' },
    { name: 'Calculators', icon: Calculator, path: '/calculators' },
    { name: 'Connect', icon: Users, path: '/connect' },
    { name: 'Quizzes', icon: Brain, path: '/quizzes' },
    { name: 'Games', icon: Gamepad2, path: '/games' },
    { name: 'Market', icon: DollarSign, path: '/market' },
  ];

  return (
    <div className="h-full bg-white p-4 space-y-4">
      {menuItems.map((item) => (
        <Link 
          key={item.name} 
          href={item.path}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium"
        >
          {/* Render the specific icon */}
          <item.icon className="w-6 h-6 text-gray-700" /> 
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );
}