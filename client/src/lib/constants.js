import {
  HeartPulse,
  Stethoscope,
  Brain,
  Flower2,
  Baby,
  Bone,
  Sparkles,
  Ear,
  Smile,
  Eye,
  Droplets,
  Pill,
} from 'lucide-react';

export const SPECIALTIES = [
  { name: 'Cardiology', bn: 'হৃদরোগ', icon: HeartPulse, chip: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', glow: 'from-rose-500/20' },
  { name: 'Internal Medicine', bn: 'মেডিসিন', icon: Stethoscope, chip: 'bg-teal-500/10 text-teal-600 dark:text-teal-400', glow: 'from-teal-500/20' },
  { name: 'Neurology', bn: 'স্নায়ুরোগ', icon: Brain, chip: 'bg-violet-500/10 text-violet-600 dark:text-violet-400', glow: 'from-violet-500/20' },
  { name: 'Gynecology & Obstetrics', bn: 'স্ত্রীরোগ', icon: Flower2, chip: 'bg-pink-500/10 text-pink-600 dark:text-pink-400', glow: 'from-pink-500/20' },
  { name: 'Pediatrics', bn: 'শিশুরোগ', icon: Baby, chip: 'bg-sky-500/10 text-sky-600 dark:text-sky-400', glow: 'from-sky-500/20' },
  { name: 'Orthopedics', bn: 'হাড় ও জোড়া', icon: Bone, chip: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', glow: 'from-amber-500/20' },
  { name: 'Dermatology', bn: 'চর্মরোগ', icon: Sparkles, chip: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400', glow: 'from-fuchsia-500/20' },
  { name: 'ENT', bn: 'নাক কান গলা', icon: Ear, chip: 'bg-lime-500/10 text-lime-600 dark:text-lime-400', glow: 'from-lime-500/20' },
  { name: 'Psychiatry', bn: 'মানসিক স্বাস্থ্য', icon: Smile, chip: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400', glow: 'from-indigo-500/20' },
  { name: 'Ophthalmology', bn: 'চক্ষুরোগ', icon: Eye, chip: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400', glow: 'from-cyan-500/20' },
  { name: 'Urology', bn: 'মূত্ররোগ', icon: Droplets, chip: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', glow: 'from-blue-500/20' },
  { name: 'Gastroenterology', bn: 'পরিপাকতন্ত্র', icon: Pill, chip: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', glow: 'from-emerald-500/20' },
];

export const specialtyMeta = (name) =>
  SPECIALTIES.find((s) => s.name === name) ?? SPECIALTIES[1];

export const DISTRICTS = [
  'Dhaka',
  'Chattogram',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Rangpur',
  'Mymensingh',
];

export const DAYS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const AVATAR_GRADIENTS = [
  'from-teal-500 to-cyan-600',
  'from-rose-500 to-orange-500',
  'from-violet-500 to-fuchsia-600',
  'from-sky-500 to-indigo-600',
  'from-amber-500 to-rose-500',
  'from-emerald-500 to-teal-600',
];

export const avatarGradient = (seed) =>
  AVATAR_GRADIENTS[
    Math.abs([...seed].reduce((a, c) => a + c.charCodeAt(0), 0)) %
      AVATAR_GRADIENTS.length
  ];

export const initials = (name) =>
  name
    .replace(/^(Prof\.|Dr\.|Assoc\.)\s*/gi, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
