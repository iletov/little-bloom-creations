import * as cron from 'node-cron';
import { NextResponse } from 'next/server';
import { cleanUpPaymentIntents } from '@/lib/cron';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// let isCronJobRunnig = false;
// let cleanupCronJob: cron.ScheduledTask | null = null;

// const cronSchedule = '0 * * * *';
// const cronSchedule = '*/5 * * * *';

export const GET = async () => {
  // if (!isCronJobRunnig) {
  //   if (cleanupCronJob) {
  //     cleanupCronJob.stop();
  //   }

  //   cleanupCronJob = cron.schedule(cronSchedule, async () => {
  //     await cleanUpPaymentIntents(stripe);
  //     console.log('==================================');
  //     console.log('***** Cron Job Running ... ***** ');
  //     console.log('==================================');
  //   });
  try {
    await cleanUpPaymentIntents(stripe);
    console.log('==================================');
    console.log('***** Cron Job Running ... ***** ');
    console.log('==================================');

    return NextResponse.json({ message: 'Cron job started' });
  } catch (error) {
    console.error('Error starting cron job:', error);
    return NextResponse.json({ message: 'Cron job already running' });
  }
};
