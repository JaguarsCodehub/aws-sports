import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className='px-14 py-12'>
      <div className='grid lg:grid-cols-2 gap-8 items-start'>
        <div>
          <h1 className='text-6xl font-bold leading-tight tracking-tighter mb-6 font-serif'>
            Manage all your
            <br />
            sports events
          </h1>
        </div>
        <div className='text-right'>
          <p className='text-muted-foreground mb-4 max-w-md ml-auto font-serif'>
            Customize your sports events, create watchlists, and receive
            tailored recommendations based on your favorite teams, players, and
            leagues
          </p>
          <Button className='group font-serif'>
            Register Now to Participate{' '}
            <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
          </Button>
        </div>
      </div>

      <div className='mt-12 grid grid-cols-12 gap-4 rounded-3xl overflow-hidden'>
        <div className='col-span-8 relative h-[400px]'>
          <Image
            src='https://images.unsplash.com/photo-1577223625816-7546f13df25d'
            alt='Football stadium with blue lighting'
            fill
            className='object-cover'
          />
          <div className='absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white'>
            <h2 className='text-2xl font-bold mb-2 font-serif'>
              FIFA U-20 World Cup Argentina 2023™ today match
            </h2>
            <p className='text-sm opacity-90 font-serif'>
              Watch some exciting matches at the FIFA U-20 World Cup which took
              place in Argentina
            </p>
            <Image
              src='https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/2023_FIFA_U-20_World_Cup.svg/150px-2023_FIFA_U-20_World_Cup.svg.png'
              alt='FIFA Logo'
              width={60}
              height={60}
              className='absolute bottom-6 right-6'
            />
          </div>
        </div>
        <div className='col-span-4 grid gap-4'>
          <div className='relative h-[195px]'>
            <Image
              src='https://images.unsplash.com/photo-1543326727-cf6c39e8f84c'
              alt='Football fans'
              fill
              className='object-cover grayscale'
            />
          </div>
          <div className='relative h-[195px]'>
            <Image
              src='https://images.unsplash.com/photo-1606925797300-0b35e9d1794e'
              alt='Young football supporter'
              fill
              className='object-cover grayscale'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
