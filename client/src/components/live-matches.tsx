import Image from 'next/image';

export function LiveMatches() {
  return (
    <section className='px-8 py-12'>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-4xl font-bold'>Live today</h2>
        <span className='text-muted-foreground'>(4 Matches)</span>
      </div>

      <div className='grid md:grid-cols-2 gap-8'>
        <div className='space-y-2'>
          <h3 className='text-xl font-semibold'>
            Manchester United vs Brighton
          </h3>
          <p className='text-sm text-muted-foreground'>
            English Premier League
          </p>
          <p className='text-sm text-muted-foreground'>07:00 PM</p>
        </div>
        <div className='relative h-[200px] rounded-xl overflow-hidden'>
          <Image
            src='https://images.unsplash.com/photo-1624880357913-a8539238245b'
            alt='Football stadium'
            fill
            className='object-cover'
          />
        </div>
      </div>
    </section>
  );
}
