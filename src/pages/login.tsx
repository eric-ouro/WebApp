import { useRouter } from 'next/router'
import { useState } from 'react'

import { createClient } from '@/utils/supabase/component'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function logIn() {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error(error)
    }
    console.log('Logged in')
    const { session } = data;

    // Retrieve the access token (JWT)
    const accessToken = session?.access_token;
    
    console.log(accessToken)

        try {
          const response = await fetch('http://ec2-3-89-122-120.compute-1.amazonaws.com/supabase/rates/company/plastic?company_id=1&startMonth=8&endMonth=8&startYear=2024&endYear=2024', {
            method: 'GET',
            headers: new Headers({
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            })
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log(data);
        } catch (error) {
          return `Error fetching plastic rates: ${error.message}`;
        }

      
    // router.push('/')


  }

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.error(error)
    }
    router.push('/')
  }

  return (
    <main>
      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={logIn}>
          Log in
        </button>
        <button type="button" onClick={signUp}>
          Sign up
        </button>
      </form>
    </main>
  )
}