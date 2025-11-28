import { db } from "./firebaseConfig.ts";
import {
  doc,
  setDoc,
  getDoc,
  writeBatch,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { auth } from "./firebaseConfig.ts";
import { supabase } from "./supabaseConfig.ts";

export const createUserProfile = async (
  username: string,
  bio: string,
  image?: File | null
): Promise<{
  success: boolean;
  reason?: string;
}> => {
  const user = auth.currentUser;
  if (!user) {
    console.log("no user signed in");
    return { success: false, reason: "user_notfound" };
  }
  const snap = await getDoc(doc(db, "profile", user.uid));
  if (snap.exists()) {
    console.log("user profile already exists");
    return { success: false, reason: "already_exists" };
  }
  const ref = doc(db, "profile", user.uid);
  let imageUrl = null;

  let storagePath = "";
  if (image) {
    const fileName = `${user.uid}-${Date.now()}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("profile-images")
      .upload(fileName, image, {
        contentType: image.type,
        cacheControl: "0",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: publicData } = supabase.storage
      .from("profile-images")
      .getPublicUrl(fileName);

    imageUrl = publicData.publicUrl;
    storagePath = fileName;
  }

  await setDoc(ref, {
    username,
    bio,
    email: user.email,
    createdAt: new Date(),
    imageUrl,
    storagePath,
  });

  console.log("created user profile with uid", user.uid);
  return { success: true };
};

type UserProfile = {
  username: string;
  bio: string;
  imageUrl?: string | null;
  storagePath?: string | null;
  email: string;
  createdAt: Date;
};

export const getUserProfile = async (
  id: string
): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(db, "profile", id));
  return snap.exists() ? (snap.data() as UserProfile) : null;
};

export const editUserProfile = async (
  username: string,
  bio: string,
  storagePath?: string | null,
  image?: File | null
): Promise<{ success: boolean; reason?: string }> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user found");
    }
    let newImageUrl = null;
    let newStoragePath = null;

    if (image && storagePath) {
      const { data: updateData, error: updateError } = await supabase.storage
        .from("profile-images")
        .update(storagePath, image, {
          contentType: image.type,
          cacheControl: "0",
          upsert: true,
        });
      if (updateError) throw updateError;
    } else if (image) {
      const fileName = `${user.uid}-${Date.now()}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, image, {
          contentType: image.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(fileName);

      newImageUrl = publicData.publicUrl;
      newStoragePath = fileName;
    }
    const body =
      newImageUrl && newStoragePath
        ? {
            username,
            bio,
            imageUrl: newImageUrl,
            storagePath: newStoragePath,
          }
        : {
            username,
            bio,
          };
    const ref = doc(db, "profile", user.uid);
    await updateDoc(ref, body);
    return { success: true };
  } catch (error: any) {
    return { success: false, reason: error.message };
  }
};

type linkItem = {
  url: string;
  platform: string;
};

export const createLinks = async (
  uid: string,
  links: linkItem[]
): Promise<{ success: boolean; reason?: string }> => {
  try {
    const batch = writeBatch(db);
    links.forEach((link) => {
      const ref = doc(db, "link", crypto.randomUUID());
      batch.set(ref, {
        uid,
        url: link.url,
        platform: link.platform,
      });
    });

    await batch.commit();
    return { success: true };
  } catch (error: any) {
    console.log("error creating links", error);
    return { success: false, reason: error.message };
  }
};

export const getLinks = async (
  uid: string
): Promise<{
  success: boolean;
  results?: Array<linkItem & { id: string; uid: string }>;
  reason?: string;
}> => {
  try {
    const q = query(collection(db, "link"), where("uid", "==", uid));
    const snap = await getDocs(q);
    const results = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as linkItem & { uid: string }),
    }));
    return { success: true, results };
  } catch (error: any) {
    return { success: false, reason: error.message };
  }
};

type EditLinkProps = {
  id: string;
  url: string;
  platform: string;
};

export const editLinks = async (
  links: EditLinkProps[]
): Promise<{ success: boolean; reason?: string }> => {
  try {
    const batch = writeBatch(db);
    links.forEach((link) => {
      if (!link.url.trim() || !link.platform.trim()) {
        throw new Error("Invalid link data");
      }
      const ref = doc(db, "link", link.id);
      batch.update(ref, {
        url: link.url,
        platform: link.platform,
      });
    });
    await batch.commit();
    return { success: true };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      reason: error ? error.message : "Some error occurred",
    };
  }
};

export const deleteLink = async (
  id: string
): Promise<{ success: boolean; reason?: string }> => {
  try {
    await deleteDoc(doc(db, "link", id));
    return { success: true };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      reason: error ? error.message : "Some error occurred",
    };
  }
};
