import '@styles/globals.css'

import Nav from '@components/Nav'
import Provider from '@components/Provider'

export const metadata = {
    title: "PromptZone",
    description: 'Discover and find cool AI prompts'
}

const RootLayout = ( { children }) => {
  return (
    <html>
        <body>
            <Provider>
            <div className='main bg-black'>
                <div className='gradient'/>
            </div>
            <main className='app'>
                <Nav />
                {children}
            </main>
            </Provider>
        </body>
        
    </html>
  )
}

export default RootLayout