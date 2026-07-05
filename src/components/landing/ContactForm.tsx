'use client'
import React from 'react'

const ContactForm = () => {

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        // Handle form submission logic here
    }

  return (
    <section className='px-4 sm:px-6 md:px-7 py-8 md:py-10 '>
      <h2 className="text-xl font-bold text-[#e8e6e0] mb-4">Get In Touch</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-center items-start bg-[#161616] border border-white/8 rounded-xl p-4 hover:border-[#EF9F27]/40 transition-colors">
        <input type="text" placeholder="Your Name"  className="bg-[#161616] border border-white/8 focus:outline-none focus:ring-2 focus:ring-[#EF9F27] w-full rounded-lg px-4 py-2" />
        <input type="email" placeholder="Your Email" className="bg-[#161616] border border-white/8 focus:outline-none focus:ring-2 focus:ring-[#EF9F27] w-full rounded-lg px-4 py-2" />
        <textarea placeholder="Your Message" className="bg-[#161616] border border-white/8 focus:outline-none focus:ring-2 focus:ring-[#EF9F27] w-full rounded-lg px-4 py-2"></textarea>
        <button type="submit" className="bg-[#EF9F27] text-[#161616] font-bold py-2 px-4 rounded-lg hover:bg-[#d48c20] transition-colors  ">
          Send Message
        </button>
      </form>
    </section>
  )
}

export default ContactForm