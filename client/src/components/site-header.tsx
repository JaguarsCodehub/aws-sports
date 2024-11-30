'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SiteHeader() {

  const router = useRouter();
  return (
    <header className="flex items-center justify-between py-6 px-14">
      <Link href="/" className="text-xl font-bold font-serif">
        sports<span className="opacity-60">101.</span>
      </Link>
      
      {/* <nav className="hidden md:flex items-center space-x-8">
        <Link href="/" className="text-sm font-medium">
          Home
        </Link>
        <Link href="/collection" className="text-sm font-medium">
          Collection
        </Link>
        <Link href="/schedule" className="text-sm font-medium">
          Schedule
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-sm font-medium">
              More <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuItem>About</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav> */}

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              EN <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>Spanish</DropdownMenuItem>
            <DropdownMenuItem>French</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="lg" className="font-medium" onClick={() => {
          router.push('/auth')
        }}>Register</Button>
      </div>
    </header>
  )
}

