export type ActiveTab = 'classes' | 'teachers' | 'teacher_profile' | 'booking_confirmed' | 'reports' | 'wallet' | 'chatbot';

export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  title: string;
  school: string;
  subject: string;
  grade: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  monthlyPrice: number;
  originalPrice: number;
  discountPercentage: number;
  isOnline: boolean;
  isVerified: boolean;
  scheduleDays: string;
  scheduleTime: string;
  groupSize: string;
  remainingSeats: number;
  totalSeats: number;
  nextLessonText: string;
  badges: string[];
}

export interface EnrolledClass {
  id: string;
  subject: string;
  subjectColorClass: string;
  title: string;
  teacherName: string;
  teacherTitle: string;
  teacherAvatar: string;
  days: string;
  time: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  accentColor: string;
  nextSessionText: string;
}

export interface SubjectCatalogItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  teachersCount: number;
  tags: string[];
  color: string;
  bgLight: string;
  borderColor: string;
}

export interface CalendarSession {
  id: string;
  subject: string;
  topic: string;
  teacherName: string;
  teacherAvatar: string;
  date: string; // YYYY-MM-DD
  dayNumber: number;
  dayOfWeek: string;
  time: string;
  durationMinutes: number;
  type: 'live' | 'trial' | 'regular' | 'exam';
  status: 'upcoming' | 'in_progress' | 'completed';
  accentColor: string;
  subjectBadgeColor: string;
  meetingRoom: string;
}
