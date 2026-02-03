import { Link } from 'react-router-dom';
export default function Welcome() {
  return (
    <Link to='/' className='flex space-x-5 justify-center items-center  bg-white font-main'>
      <img src="/images/ticketB.png" className="w-8" alt="welcomeIcon" />
      <h1 className='text-2xl inline'><span className='text-first capitalize'>support</span> <span className='text-second capitalize'>ticket</span> <span className='text-third capitalize'>system</span></h1>
    </Link>
  )
};