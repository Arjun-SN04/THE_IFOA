import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Lock, Mail, UserCheck, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react'
import ifoaLogo from '@/assets/brand/ifoa-logoweb.png'

export function LoginModal({ isOpen, onClose }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onClose()
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[460px] bg-white border border-black/10 p-0 overflow-hidden rounded-2xl shadow-2xl">
        <div className="bg-rocket-dark p-6 text-white text-center relative flex flex-col items-center">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-rocket-lime" />
          </div>
          <DialogTitle className="text-2xl font-bold font-display text-white">
            IFOA Portal Access
          </DialogTitle>
          <DialogDescription className="text-white/70 text-xs mt-1">
            Access certified student syllabi, EASA exams, or airline compliance rosters.
          </DialogDescription>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-3 border-rocket-lime border-t-transparent rounded-full animate-spin"></div>
              <h4 className="text-lg font-bold font-display text-rocket-dark">Authenticating Secure Session...</h4>
              <p className="text-xs text-gray-500">Connecting to IFOA Global LMS Server</p>
            </div>
          ) : (
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-rocket-gray rounded-xl mb-4">
                <TabsTrigger value="student" className="text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-rocket-dark data-[state=active]:shadow-sm">
                  Student Portal
                </TabsTrigger>
                <TabsTrigger value="airline" className="text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-rocket-dark data-[state=active]:shadow-sm">
                  Airline Partner OCC
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Student ID or Registered Email
                    </label>
                    <Input
                      required
                      type="text"
                      placeholder="e.g. IFOA-2025-089"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="rounded-xl border-black/15"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Password
                      </label>
                      <a href="#forgot" className="text-xs text-gray-500 hover:text-black">
                        Forgot?
                      </a>
                    </div>
                    <Input
                      required
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl border-black/15"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-rocket-dark text-white hover:bg-rocket-lime hover:text-black font-bold rounded-full py-3 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs mt-2"
                  >
                    Log In <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </form>

                <div className="pt-3 border-t border-black/10 text-center">
                  <p className="text-xs text-gray-500">
                    Need course enrollment first?{' '}
                    <a href="#services" onClick={onClose} className="text-xs font-bold text-rocket-dark hover:underline">
                      View Available Intakes
                    </a>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
