"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getProfile } from "@/lib/api"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, X } from "lucide-react"
import { updateProfile } from "@/lib/api"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  const [countries, setCountries] = useState<{ name: string, code: string }[]>([]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data
          .map((c: any) => ({
            name: c.name.common,
            code: c.cca2,
          }))
          .sort((a: any, b: any) => a.name.localeCompare(b.name));
        setCountries(sorted);
      })
      .catch((err) => console.error("Failed to load countries", err));
  }, []);

  const [form, setForm] = useState({
    full_name: "",
    bio: "",
    country: "",
    mobile: ""
  })


  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/login")
      return
    }
    getProfile(token)
      .then((data) => {
        setUser(data)
        setForm({
          full_name: data.full_name || "",
          bio: data.bio || "",
          country: data.country || "",
          mobile: data.mobile || ""
        })
      })
      .catch(() => router.push("/login"))
  }, [router])
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    try {
      const updated = await updateProfile(token, form)
      setUser(updated.profile) // update UI
      setIsEditing(false)
    } catch (err) {
      console.error("Update failed", err)
    }
  }

  

  if (!user)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-400 text-sm">Loading...</div>
      </div>
    )

  return (
    <div className="p-5">
    <div className=" bg-black flex items-center justify-center pt-20">
      <Card className="w-full max-w-2xl bg-zinc-950 border-zinc-800 text-white shadow-2xl overflow-hidden">
       

        <CardHeader className="relative  pb-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-zinc-950">
                <AvatarImage src={user.profile_pic || "/placeholder.svg"} alt={user.full_name} />
                <AvatarFallback className="bg-zinc-800 text-zinc-300 text-3xl">
                  {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold">{user.full_name || "Unnamed User"}</h1>
                <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-700">
                  Active
                </Badge>
              </div>
              <p className="text-zinc-400">{user.email}</p>
            </div>

            <div className="grid grid-cols-4 gap-8 mt-6 w-full max-w-md">
              <div className="text-center">
                <p className="text-zinc-400 text-sm">First seen</p>
                <p className="text-white font-medium">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-zinc-400 text-sm">Username</p>
                <p className="text-white font-medium">@{user.username}</p>
              </div>
              <div className="text-center">
                <p className="text-zinc-400 text-sm">Country</p>
                <p className="text-white font-medium">{user.country || "N/A"}</p>
              </div>
              <div className="text-center">
                <p className="text-zinc-400 text-sm">Mobile</p>
                <p className="text-white font-medium">{user.mobile || "N/A"}</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="flex flex-col space-y-2">
                  <Label className="text-zinc-300 text-sm font-medium">Name</Label>
                  <Input
                    value={form.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Full name"
                    className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500 h-12 rounded-lg"
                  />
                </div>

                {/* Country */}
                <div className="flex flex-col space-y-2">
                  <Label className="text-zinc-300 text-sm font-medium">Country</Label>
                  <Select
                    disabled={!isEditing}
                    value={form.country}
                    onValueChange={(value) => handleChange("country", value)}
                  >
                    <SelectTrigger className="bg-zinc-900  border-zinc-700 text-white h-12 rounded-lg">
                      <SelectValue placeholder="Select country " />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                      
                      {countries.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>


            <div className="space-y-3">
              <Label className="text-zinc-300 text-sm font-medium">Email address</Label>
              <div className="relative">
                <Input
                  value={user.email}
                  disabled
                  className="bg-zinc-900 border-zinc-700 text-zinc-400 h-12 rounded-lg pl-10"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 bg-zinc-600 rounded"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-blue-400" />
                <span className="text-zinc-400">VERIFIED {new Date().toLocaleDateString().toUpperCase()}</span>
              </div>
              
            </div>

            <div className="space-y-3">
              <Label className="text-zinc-300 text-sm font-medium">Bio</Label>
              <Textarea
                value={form.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500 resize-none h-24 rounded-lg"
              />

            </div>

           

            <div className="space-y-3">
              <Label className="text-zinc-300 text-sm font-medium">Mobile</Label>
              <Input
              value={form.mobile}
              onChange={(e) => handleChange("mobile", e.target.value)}
              disabled={!isEditing}
              placeholder="+1 234 567 8900"
              className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500 h-12 rounded-lg"
            />

            </div>
         

          <div className="flex justify-end gap-4 pt-6">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="border-zinc-600 text-zinc-300 hover:bg-zinc-800 px-8 h-12 rounded-lg"
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-zinc-700 text-white hover:bg-zinc-600 px-8 h-12 rounded-lg">Save changes</Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-zinc-700 text-white hover:bg-zinc-600 px-8 h-12 rounded-lg"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  )
}
