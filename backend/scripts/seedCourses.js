// Seeds one fully-populated course so the public detail page and the admin
// editor have real data to work with. Safe to re-run — it upserts by slug.
// Run: npm run seed:courses
require('dotenv').config()

const mongoose = require('mongoose')
const { connectDB } = require('../config/db')
const Course = require('../models/Course')

const courses = [
  {
    title: 'IFOA India - 4 Weeks - Flight Operations and Flight Dispatch Program',
    slug: 'ifoa-india-4-weeks-flight-operations-flight-dispatch-program',
    refCode: 'IPIN2501',
    branch: 'IFOA India',
    category: 'dispatch',
    status: 'published',
    featured: true,
    order: 1,
    summary:
      'A 4-week onsite Flight Operations and Flight Dispatch program delivered by an IFOA-certified instructor at the Indian Aviation Academy, New Delhi.',
    schedule: {
      mode: 'Onsite',
      startDate: new Date('2026-03-31T09:00:00+05:30'),
      endDate: new Date('2026-04-25T17:00:00+05:30'),
      timeText: 'MO - FRI 0900AM - 0500PM IST',
      timezone: 'IST'
    },
    duration: '4 Weeks',
    location: 'New Delhi',
    price: {
      amount: 99000,
      currency: 'INR',
      note: '18% GST must be added to the price mentioned'
    },
    whatYouWillLearn: {
      intro:
        'Our students will acquire the essential fundamental competencies to mobilize the relevant knowledge, skills, and attitude to carry out activities and tasks associated with the International flight dispatcher duties and responsibilities, but also the know-how:',
      points: [
        'To contribute to the safety and efficiency of the flight operations',
        'To enhance the situation awareness, proactivity, and collaborative decision-making',
        'To assess and anticipate operational situation risks',
        'To optimize working resource allocation and work outside defined tasks'
      ]
    },
    delivery: {
      intro:
        'The Flight Operations and Flight Dispatch Program is delivered by an IFOA-certified instructor onsite in the Indian Aviation Academy',
      items: [
        {
          label: 'School',
          title: 'IFOA India',
          description:
            'The training is delivered by the International Flight Operations Academy India'
        },
        {
          label: 'Format',
          title: 'Indian Aviation Academy',
          description: '4 Weeks Classroom Training at Indian Aviation Academy'
        }
      ]
    },
    trainingStandards: {
      intro:
        'Our comprehensive International Flight Dispatch Advanced Training program meets the rigorous standards set by ICAO Annex 1 & 6, as recommended in ICAO Doc 10106, and aligns with EASA Part ORO GEN 110(c) and the competencies outlined by the Directorate General of Civil Aviation (DGCA)',
      logos: []
    },
    whoShouldAttend: {
      intro:
        'Our Program is designed for individuals who are seeking to begin or advance their careers in aviation operations. This program is ideal for:',
      points: [
        'Aspiring flight dispatchers',
        'CPL Pilot students',
        'Airline personnel',
        'Air Traffic Controllers',
        'Aviation enthusiasts'
      ],
      outro:
        'looking to gain essential skills in flight operations, regulatory compliance, and operational safety. Whether you are just starting out or transitioning from another role in aviation, this training equips you with the knowledge needed to support safe and efficient flight operations.'
    },
    courseContent: {
      intro:
        'This training program meets the DGCA and International (ICAO) requirements according to the prerequisite learning objectives set in the different regulations:',
      modules: [
        'Introduction to International Flight Dispatch Function',
        'Air Law & Regulations - ICAO, EASA and DGCA',
        'Aircraft Systems',
        'Aircraft Instrumentation',
        'Flight Monitoring',
        'Mass & Balance',
        'Flight Planning',
        'Human Performance',
        'Meteorology - including specific Indian climatology',
        'Navigation',
        'Operational Procedures',
        'Principles of Flight',
        'Aircraft Performance',
        'Communication',
        'Air Traffic Management - International and India',
        'Assessment of Pilot Medical and Physical Pilot Conditions - India-Specific Training',
        'B737-NG Technical Training from the cockpit',
        'Group Discussion and Exercise - Decision Making in Operations'
      ],
      note: 'The training program includes manual practical flight planning using the Boeing B737-NG.'
    },
    certification: {
      text:
        'Upon successfully completing the exam, you will be awarded an IFOA India Flight Dispatch Completion Certificate, valid for an unlimited period.',
      points: ['Practical and multiple-choice questions', '80% required to pass.']
    },
    registrationOpen: true,
    seo: {
      metaTitle: 'IFOA India – 4 Weeks Flight Operations & Flight Dispatch Program (IPIN2501)',
      metaDescription:
        'DGCA and ICAO-aligned 4-week onsite Flight Dispatch program at the Indian Aviation Academy, New Delhi. 99000 INR.'
    }
  }
]

async function run() {
  await connectDB()

  for (const data of courses) {
    const existing = await Course.findOne({ slug: data.slug })
    if (existing) {
      existing.set(data)
      await existing.save()
      console.log(`Updated: ${existing.slug}`)
    } else {
      const created = await Course.create(data)
      console.log(`Created: ${created.slug}`)
    }
  }

  await mongoose.disconnect()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
