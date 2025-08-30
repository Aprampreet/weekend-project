"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getProfile, updateProfile } from "@/lib/api"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [countries, setCountries] = useState<{ name: string; code: string }[]>([])
  const [preview, setPreview] = useState<string | null>(null)
  const router = useRouter()

  const [form, setForm] = useState({
    profile_pic: null as File | null,
    full_name: "",
    bio: "",
    country: "",
    mobile: "",
  })

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
      .then(res => res.json())
      .then(data => {
        const sorted = data
          .map((c: any) => ({ name: c.name.common, code: c.cca2 }))
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
        setCountries(sorted)
      })
      .catch(err => console.error("Failed to load countries", err))
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/login")
      return
    }

    getProfile(token)
      .then(data => {
        setUser(data)
        setForm({
          profile_pic: null,
          full_name: data.full_name || "",
          bio: data.bio || "",
          country: data.country || "",
          mobile: data.mobile || "",
        })
      })
      .catch(() => router.push("/login"))
  }, [router])

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0]
    setForm(prev => ({ ...prev, profile_pic: file }))

    const url = URL.createObjectURL(file)
    setPreview(url)
  }
}

 const handleSave = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  try {
    const dataToUpdate = {
      full_name: form.full_name,
      bio: form.bio,
      country: form.country,
      mobile: form.mobile,
    };

    const updated = await updateProfile(token, dataToUpdate, form.profile_pic || undefined);

    const updatedProfile = updated?.profile;

    if (updatedProfile?.profile_pic && !updatedProfile.profile_pic.startsWith("http")) {
      updatedProfile.profile_pic = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"}${updatedProfile.profile_pic}`;
    }

    if (updatedProfile) {
      setUser(updatedProfile);
    }

    setPreview(null);
    setIsEditing(false);
  } catch (err) {
    console.error("Failed to update profile", err);
  }
};


  if (!user)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-400 text-sm">Loading...</div>
      </div>
    )

  return (
    <AnimatePresence mode="wait">
      <motion.div
        
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
    <div className="p-5 bg-black min-h-screen flex justify-center pt-20">
      <Card className="w-full max-w-2xl bg-zinc-950 border-zinc-800 text-white shadow-2xl overflow-hidden">
        <CardHeader className="relative pb-6 flex flex-col items-center space-y-4">
          <div className="relative flex flex-col items-center">
            <Avatar className="w-32 h-32 border-4 border-zinc-900">
            <AvatarImage
              src={preview || user?.profile_pic || "/placeholder.svg"}
              alt={user?.full_name || "User"}
            />
            <AvatarFallback className="bg-zinc-800 text-zinc-300 text-3xl">
              {user?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>


            <input
              type="file"
              id="profile-pic-upload"
              accept="image/*"
              disabled={!isEditing}
              onChange={handleFileChange}
              className="hidden"
            />

            {isEditing && (
              <label
                htmlFor="profile-pic-upload"
                className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition"
              >
                <CheckCircle className="h-5 w-5 text-white" />
              </label>
            )}

            <Label className="mt-3 text-zinc-300 text-sm font-medium">Profile Picture</Label>
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
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          {/* Name & Country */}
          <div className="grid grid-cols-2 gap-6">
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
            <div className="flex flex-col space-y-2">
              <Label className="text-zinc-300 text-sm font-medium">Country</Label>
              <Select disabled={!isEditing} value={form.country} onValueChange={(v) => handleChange("country", v)}>
                <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white h-12 rounded-lg">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                  {countries.map(c => (
                    <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-3">
            <Label className="text-zinc-300 text-sm font-medium">Email address</Label>
            <Input value={user.email} disabled className="bg-zinc-900 border-zinc-700 text-zinc-400 h-12 rounded-lg" />
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-blue-400" />
              <span className="text-zinc-400">VERIFIED {new Date().toLocaleDateString().toUpperCase()}</span>
            </div>
          </div>

          {/* Bio */}
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

          {/* Mobile */}
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

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="border-zinc-600 text-zinc-300 hover:bg-zinc-800 px-8 h-12 rounded-lg">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-zinc-700 text-white hover:bg-zinc-600 px-8 h-12 rounded-lg">
                  Save changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="bg-zinc-700 text-white hover:bg-zinc-600 px-8 h-12 rounded-lg">
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
     </motion.div>
    </AnimatePresence>
  )
}
