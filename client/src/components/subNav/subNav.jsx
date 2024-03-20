import React from 'react';
import { SocialIcon } from 'react-social-icons'
import { PhoneIcon  } from '@heroicons/react/24/solid';
const SubNav = () => {
 
    return ( 
        <div className='flex flex-1 justify-between items-center bg-gray-950 lg:pl-20 lg:pr-20'>
            <div className='flex flex-row gap-2'>
            <PhoneIcon className="h-6 w-6 text-[gray] " opacity={0.4} />
            <p className='text-[gray]'>+234123456789</p>
            </div>
            <div className=''>  
                <SocialIcon url='https://wa.me/'  fgColor='gray' bgColor='transparent'/>
                <SocialIcon url='https://www.facebook.com/'  fgColor='gray' bgColor='transparent'/>
                <SocialIcon url='https://twitter.com/'  fgColor='gray' bgColor='transparent'/>
                <SocialIcon url='https://www.instagram.com/'  fgColor='gray' bgColor='transparent'/>
               
               
               </div>
        </div>
     );
}
 
export default SubNav;