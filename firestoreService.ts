import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  BhandaraEvent,
  Review,
  VolunteerRegistration,
  InKindNeed,
  FlagReport,
} from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMessage = error instanceof Error ? error.message : String(error);
  if (
    errMessage.includes('Could not reach Cloud Firestore backend') ||
    errMessage.includes('offline') ||
    errMessage.includes('timeout') ||
    errMessage.includes('Seed timeout')
  ) {
    console.warn(`[Firestore Offline/Pending] Operation: ${operationType} on ${path} (${errMessage})`);
    return;
  }
  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    operationType,
    path,
  };
  console.warn('Firestore Note: ', JSON.stringify(errInfo));
}

// Helper to remove undefined fields before writing to Firestore
function sanitizeDoc<T extends object>(data: T): T {
  const cleanObj: any = {};
  Object.keys(data).forEach((key) => {
    const val = (data as any)[key];
    if (val !== undefined) {
      cleanObj[key] = val;
    }
  });
  return cleanObj as T;
}

// 1. Subscribe to Collections in Real Time
export function subscribeToBhandaras(
  callback: (data: BhandaraEvent[]) => void,
  fallbackData?: BhandaraEvent[]
) {
  return onSnapshot(
    collection(db, 'bhandaras'),
    (snapshot) => {
      const items: BhandaraEvent[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as BhandaraEvent);
      });
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      if (items.length === 0 && fallbackData && fallbackData.length > 0) {
        callback(fallbackData);
      } else {
        callback(items);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'bhandaras');
      if (fallbackData && fallbackData.length > 0) {
        callback(fallbackData);
      }
    }
  );
}

export function subscribeToTrashBhandaras(callback: (data: BhandaraEvent[]) => void) {
  return onSnapshot(
    collection(db, 'trash_bhandaras'),
    (snapshot) => {
      const items: BhandaraEvent[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as BhandaraEvent);
      });
      callback(items);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'trash_bhandaras');
    }
  );
}

export function subscribeToReviews(
  callback: (data: Review[]) => void,
  fallbackData?: Review[]
) {
  return onSnapshot(
    collection(db, 'reviews'),
    (snapshot) => {
      const items: Review[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Review);
      });
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      if (items.length === 0 && fallbackData && fallbackData.length > 0) {
        callback(fallbackData);
      } else {
        callback(items);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'reviews');
      if (fallbackData && fallbackData.length > 0) {
        callback(fallbackData);
      }
    }
  );
}

export function subscribeToVolunteers(callback: (data: VolunteerRegistration[]) => void) {
  return onSnapshot(
    collection(db, 'volunteers'),
    (snapshot) => {
      const items: VolunteerRegistration[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as VolunteerRegistration);
      });
      callback(items);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'volunteers');
    }
  );
}

export function subscribeToNeeds(
  callback: (data: InKindNeed[]) => void,
  fallbackData?: InKindNeed[]
) {
  return onSnapshot(
    collection(db, 'needs'),
    (snapshot) => {
      const items: InKindNeed[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as InKindNeed);
      });
      if (items.length === 0 && fallbackData && fallbackData.length > 0) {
        callback(fallbackData);
      } else {
        callback(items);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'needs');
      if (fallbackData && fallbackData.length > 0) {
        callback(fallbackData);
      }
    }
  );
}

export function subscribeToReports(callback: (data: FlagReport[]) => void) {
  return onSnapshot(
    collection(db, 'reports'),
    (snapshot) => {
      const items: FlagReport[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as FlagReport);
      });
      callback(items);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'reports');
    }
  );
}

// 2. Initial Data Seeding
export async function seedInitialFirestoreData(
  initialBhandaras: BhandaraEvent[],
  initialReviews: Review[],
  initialNeeds: InKindNeed[]
) {
  try {
    const bhandarasSnap = await getDocs(collection(db, 'bhandaras'));
    const existingBhandaraIds = new Set(bhandarasSnap.docs.map((d) => d.id));
    for (const b of initialBhandaras) {
      if (!existingBhandaraIds.has(b.id)) {
        await setDoc(doc(db, 'bhandaras', b.id), sanitizeDoc(b));
      }
    }

    const reviewsSnap = await getDocs(collection(db, 'reviews'));
    if (reviewsSnap.empty) {
      for (const r of initialReviews) {
        await setDoc(doc(db, 'reviews', r.id), sanitizeDoc(r));
      }
    }

    const needsSnap = await getDocs(collection(db, 'needs'));
    if (needsSnap.empty) {
      for (const n of initialNeeds) {
        await setDoc(doc(db, 'needs', n.id), sanitizeDoc(n));
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'initial_seeding');
  }
}

// 3. Mutation Operations
export async function saveBhandaraToFirestore(bhandara: BhandaraEvent) {
  try {
    await setDoc(doc(db, 'bhandaras', bhandara.id), sanitizeDoc(bhandara), { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `bhandaras/${bhandara.id}`);
  }
}

export async function moveBhandaraToTrash(bhandara: BhandaraEvent) {
  try {
    await setDoc(doc(db, 'trash_bhandaras', bhandara.id), sanitizeDoc(bhandara));
    await deleteDoc(doc(db, 'bhandaras', bhandara.id));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `trash_bhandaras/${bhandara.id}`);
  }
}

export async function restoreBhandaraFromTrash(bhandara: BhandaraEvent) {
  try {
    await setDoc(doc(db, 'bhandaras', bhandara.id), sanitizeDoc(bhandara));
    await deleteDoc(doc(db, 'trash_bhandaras', bhandara.id));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `bhandaras/${bhandara.id}`);
  }
}

export async function permDeleteBhandaraFromTrash(id: string) {
  try {
    await deleteDoc(doc(db, 'trash_bhandaras', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `trash_bhandaras/${id}`);
  }
}

export async function updateBhandaraVerification(id: string, isVerified: boolean) {
  try {
    await updateDoc(doc(db, 'bhandaras', id), {
      isVerified,
      organizerType: isVerified ? 'verified_ind' : 'unverified',
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `bhandaras/${id}`);
  }
}

export async function addReviewToFirestore(review: Review, allBhandaraReviews: Review[], bhandara: BhandaraEvent | undefined) {
  try {
    await setDoc(doc(db, 'reviews', review.id), sanitizeDoc(review));
    if (bhandara) {
      const updatedReviews = [review, ...allBhandaraReviews];
      const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
      await updateDoc(doc(db, 'bhandaras', bhandara.id), {
        ratingAvg: parseFloat(avg.toFixed(1)),
        ratingCount: updatedReviews.length,
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `reviews/${review.id}`);
  }
}

export async function addVolunteerToFirestore(volunteer: VolunteerRegistration) {
  try {
    await setDoc(doc(db, 'volunteers', volunteer.id), sanitizeDoc(volunteer));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `volunteers/${volunteer.id}`);
  }
}

export async function addNeedToFirestore(need: InKindNeed) {
  try {
    await setDoc(doc(db, 'needs', need.id), sanitizeDoc(need));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `needs/${need.id}`);
  }
}

export async function fulfillNeedInFirestore(needId: string) {
  try {
    await updateDoc(doc(db, 'needs', needId), { status: 'Fulfilled' });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `needs/${needId}`);
  }
}

export async function addReportToFirestore(report: FlagReport) {
  try {
    await setDoc(doc(db, 'reports', report.id), sanitizeDoc(report));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `reports/${report.id}`);
  }
}

export async function resolveReportInFirestore(reportId: string) {
  try {
    await deleteDoc(doc(db, 'reports', reportId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `reports/${reportId}`);
  }
}

export async function deleteReportedBhandara(reportId: string, bhandara: BhandaraEvent | undefined) {
  try {
    if (bhandara) {
      await moveBhandaraToTrash(bhandara);
    }
    await deleteDoc(doc(db, 'reports', reportId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `reports/${reportId}`);
  }
}

