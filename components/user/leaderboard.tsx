"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Star } from "lucide-react"

interface LeaderboardEntry {
  id: string
  name: string
  avatar: string
  points: number
  coursesCompleted: number
  certificatesEarned: number
  rank: number
  badge: "gold" | "silver" | "bronze" | "none"
}

export function Leaderboard() {
  const [leaderboard] = useState<LeaderboardEntry[]>([
    {
      id: "1",
      name: "Satyajit Sen",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 2850,
      coursesCompleted: 12,
      certificatesEarned: 8,
      rank: 1,
      badge: "gold",
    },
    {
      id: "2",
      name: "Zuniyed Hossain",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 2650,
      coursesCompleted: 10,
      certificatesEarned: 7,
      rank: 2,
      badge: "silver",
    },
    {
      id: "3",
      name: "Naveed Anzum",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 2400,
      coursesCompleted: 9,
      certificatesEarned: 6,
      rank: 3,
      badge: "bronze",
    },
    {
      id: "4",
      name: "L.M. Mahir Labib",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 2200,
      coursesCompleted: 8,
      certificatesEarned: 5,
      rank: 4,
      badge: "none",
    },
    {
      id: "5",
      name: "Audity Mehnaz",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 2100,
      coursesCompleted: 7,
      certificatesEarned: 5,
      rank: 5,
      badge: "none",
    },
  ])

  const getBadgeIcon = (badge: string, rank: number) => {
    switch (badge) {
      case "gold":
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case "silver":
        return <Medal className="w-6 h-6 text-gray-400" />
      case "bronze":
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500"
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600"
      default:
        return "bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Leadership Board
        </h2>
        <p className="text-gray-600">See how you rank among your peers</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {leaderboard.slice(0, 3).map((entry, index) => (
          <Card key={entry.id} className={`${getRankColor(entry.rank)} text-white`}>
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">{getBadgeIcon(entry.badge, entry.rank)}</div>
              <Avatar className="w-16 h-16 mx-auto mb-4 border-4 border-white">
                <AvatarImage src={entry.avatar || "/placeholder.svg"} />
                <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg">{entry.name}</h3>
              <p className="text-sm opacity-90">{entry.points} points</p>
              <div className="flex justify-center gap-4 mt-4 text-xs">
                <div>
                  <p className="font-semibold">{entry.coursesCompleted}</p>
                  <p className="opacity-75">Courses</p>
                </div>
                <div>
                  <p className="font-semibold">{entry.certificatesEarned}</p>
                  <p className="opacity-75">Certificates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Full Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  entry.rank <= 3 ? "bg-gradient-to-r from-blue-50 to-purple-50" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10">
                    {getBadgeIcon(entry.badge, entry.rank)}
                  </div>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={entry.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{entry.name}</h3>
                    <p className="text-sm text-gray-600">{entry.points} points</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-semibold">{entry.coursesCompleted}</p>
                    <p className="text-gray-600">Courses</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{entry.certificatesEarned}</p>
                    <p className="text-gray-600">Certificates</p>
                  </div>
                  <Badge variant={entry.rank <= 3 ? "default" : "secondary"}>Rank #{entry.rank}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card>
        
        
      </Card>
    </div>
  )
}
