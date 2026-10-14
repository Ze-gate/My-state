export const metadata = {

title: 'Global Time & Weather Explorer',

description: 'Fullstack Next.js app combining REST Countries API and Open-Meteo Weather API deployed on Vercel.',

};

​export default function RootLayout({ children }) {

return (

<html lang="id">

<body style={{ margin: 0, padding: 0, backgroundColor: '#0f172a' }}>

{children}

</body>

</html>

);

}

