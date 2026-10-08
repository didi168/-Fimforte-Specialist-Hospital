/**
 * FIMFORTE SPECIALIST HOSPITAL — TESTIMONIALS & REVIEWS DATA LAYER
 * - Supabase: Structured Patient Review Text, Ratings, Department & Dates
 * - Cloudinary: High-Performance CDN Hosting for Photos & Video Testimonials
 */

// =========================================================================
// 1. SUPABASE CONFIGURATION (For Structured Review Text, Ratings & Depts)
// Get your URL & Anon Key from: Supabase Dashboard -> Project Settings -> API
// =========================================================================
const SUPABASE_CONFIG = {
  url: 'https://dynvrqtreuiogeqxdqsx.supabase.co', // e.g. 'https://your-project-id.supabase.co'
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bnZycXRyZXVpb2dlcXhkcXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0MjAyMzksImV4cCI6MjEwNjk5NjIzOX0.WV-qPsWVJPUYTHcUjJnj_Jv4CK_22aEDURpoTokwqAw' // e.g. 'eyJhbGciOiJIUzI1NiIsIn...'
};

// =========================================================================
// 2. CLOUDINARY CONFIGURATION (For Photos & Video Streaming / CDN)
// 1. Create a free account at https://cloudinary.com
// 2. Go to: Settings (Gear icon) -> Upload -> Add upload preset
// 3. Set Signing Mode to 'Unsigned' (e.g. 'fimforte_unsigned')
// =========================================================================
const CLOUDINARY_CONFIG = {
  cloudName: 'blackbee', // e.g. 'fimforte-health'
  uploadPreset: 'fimforte', // e.g. 'fimforte_unsigned'
  folder: 'fimforte' // optional folder in Cloudinary
};

let supabaseClient = null;
function getSupabase() {
  if (supabaseClient) return supabaseClient;
  if (typeof window !== 'undefined' && window.supabase && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      return supabaseClient;
    } catch (err) {
      console.warn('Supabase initialization error:', err);
    }
  }
  return null;
}

/**
 * Upload raw photo or video directly from the browser to Cloudinary CDN
 */
async function uploadMediaToCloudinary(file) {
  if (!CLOUDINARY_CONFIG.cloudName || !CLOUDINARY_CONFIG.uploadPreset) {
    console.info('Cloudinary credentials not set. Falling back to local data preview.');
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    if (CLOUDINARY_CONFIG.folder) {
      formData.append('folder', CLOUDINARY_CONFIG.folder);
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`;
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('Cloudinary upload error:', errData);
      return null;
    }

    const data = await response.json();
    const isVideo = data.resource_type === 'video';

    // Cloudinary auto-generates a JPG thumbnail for any uploaded video!
    const thumbnail = isVideo
      ? data.secure_url.replace(/\.[^/.]+$/, ".jpg")
      : data.secure_url;

    let formattedDuration = '0:35';
    if (data.duration) {
      const mins = Math.floor(data.duration / 60);
      const secs = Math.floor(data.duration % 60).toString().padStart(2, '0');
      formattedDuration = `${mins}:${secs}`;
    }

    return {
      url: data.secure_url,
      thumbnail: thumbnail,
      duration: formattedDuration,
      resourceType: data.resource_type
    };
  } catch (err) {
    console.error('Error uploading file to Cloudinary:', err);
    return null;
  }
}

const SEED_TESTIMONIALS = [
  {
    id: "test-001",
    author: "Chidinma O.",
    location: "Resident, Mgbuoba Port Harcourt",
    department: "Emergency & Casualty",
    rating: 5,
    type: "text",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    quote: "When an emergency occurred at 1:00 AM, Fimforte's medical team admitted us without delay. The clinical wards are remarkably clean, and the doctors were fully attentive throughout the night.",
    date: "2 weeks ago"
  },
  {
    id: "test-002",
    author: "Blessing & Emeka K.",
    location: "Maternity Patients, Port Harcourt",
    department: "Obstetrics & Gynaecology",
    rating: 5,
    type: "video",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-mother-holding-her-sleeping-baby-41270-large.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&auto=format&fit=crop&q=80",
    videoDuration: "0:45",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    quote: "Dr. Fimber Chukwuka is an exceptional obstetrician. His antenatal guidance and calm reassurance made our delivery safe and peaceful. Highly recommend Fimforte for all expectant mothers.",
    date: "1 month ago"
  },
  {
    id: "test-003",
    author: "Tari E.",
    location: "NHIS Policyholder, GRA Phase 2",
    department: "Internal Medicine",
    rating: 5,
    type: "text",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    quote: "The nursing team here is extraordinarily polite and empathetic. Our NHIS coverage was seamlessly processed with zero unnecessary delays. Wheelchair access made visits stress-free for my elderly father.",
    date: "1 month ago"
  },
  {
    id: "test-004",
    author: "Mrs. Nkiru Davies",
    location: "Mother of 2, Peter Odili Road",
    department: "Paediatrics & Neonatal",
    rating: 5,
    type: "video",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-doctor-checking-a-little-girl-with-a-stethoscope-41285-large.mp4",
    videoThumbnail: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80",
    videoDuration: "1:10",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    quote: "Dr. Adanwa in Paediatrics took care of my newborn with so much warmth. The nurses don't yell, the ward is cool, and the medication instructions were super thorough. I felt entirely safe here.",
    date: "3 weeks ago"
  },
  {
    id: "test-005",
    author: "Chief O. Briggs",
    location: "Corporate Patient, Trans-Amadi",
    department: "General Surgery",
    rating: 5,
    type: "text",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
    quote: "Had an emergency surgical procedure under Dr. Samuel Adebayo. The surgical theatre is world-class and post-op recovery was monitored hourly. Fimforte is standard healthcare right here in Rivers State.",
    date: "2 months ago"
  }
];

const TESTIMONIALS_STORAGE_KEY = 'fimforte_approved_testimonials_v1';

/**
 * Retrieve combined list of seed testimonials + user submitted testimonials from localStorage
 */
function getCombinedTestimonials() {
  try {
    const custom = JSON.parse(localStorage.getItem(TESTIMONIALS_STORAGE_KEY) || '[]');
    return [...custom, ...SEED_TESTIMONIALS];
  } catch (err) {
    console.warn('Error reading stored testimonials:', err);
    return SEED_TESTIMONIALS;
  }
}

/**
 * Async fetcher that pulls approved testimonials directly from Supabase if configured,
 * and falls back seamlessly to localStorage + seed data.
 */
/**
 * Async fetcher that pulls approved testimonials directly from Supabase if configured,
 * and falls back seamlessly to localStorage + seed data.
 */
async function fetchAllTestimonialsAsync() {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped = data.map(row => {
          const isVideo = row.type === 'video' || !!row.video_url;
          let storyPhoto = null;
          let avatar = row.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';

          if (row.photo_url && row.photo_url.includes('|')) {
            const parts = row.photo_url.split('|');
            storyPhoto = parts[0];
            avatar = parts[1];
          } else if (row.type === 'photo') {
            storyPhoto = row.photo_url;
          }

          let thumb = storyPhoto || row.photo_url;
          if (!thumb && row.video_url) {
            thumb = row.video_url.replace(/\.[^/.]+$/, ".jpg");
          }

          return {
            id: row.id,
            author: row.author,
            location: row.location || 'Port Harcourt',
            department: row.department,
            attendingDoctor: row.attending_doctor || null,
            rating: row.rating || 5,
            type: isVideo ? 'video' : (storyPhoto ? 'photo' : (row.type || 'text')),
            verified: true,
            avatar: avatar,
            storyPhoto: storyPhoto,
            videoUrl: row.video_url || null,
            videoThumbnail: thumb,
            videoDuration: 'Patient Story',
            quote: row.quote,
            date: 'Verified Patient'
          };
        });

        // Merge with local reviews while preventing duplicate IDs
        const localReviews = getCombinedTestimonials();
        const existingIds = new Set(mapped.map(m => m.id));
        const nonDuplicateLocal = localReviews.filter(l => !existingIds.has(l.id));

        return [...mapped, ...nonDuplicateLocal];
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local dataset:', err);
    }
  }

  return getCombinedTestimonials();
}

/**
 * Store a new user testimonial:
 * 1. Uploads media (profile picture and/or story photo/video) directly to Cloudinary CDN
 * 2. Saves structured review record (author, department, quote, rating, media URLs) to Supabase table
 * 3. Falls back to localStorage if offline
 */
async function saveTestimonial(testimonial, mediaOptions = null) {
  let profilePicFile = null;
  let storyFile = null;

  if (mediaOptions instanceof File || (mediaOptions && mediaOptions.size)) {
    storyFile = mediaOptions;
  } else if (mediaOptions && typeof mediaOptions === 'object') {
    profilePicFile = mediaOptions.profilePicFile || null;
    storyFile = mediaOptions.storyFile || null;
  }

  let profilePicUrl = testimonial.avatar;
  let storyPhotoUrl = testimonial.storyPhoto || null;
  let videoUrl = testimonial.videoUrl;
  let videoThumbnail = testimonial.videoThumbnail;

  // 1. Upload Patient Profile Picture to Cloudinary (if provided)
  if (profilePicFile) {
    const profilePicResult = await uploadMediaToCloudinary(profilePicFile);
    if (profilePicResult && profilePicResult.url) {
      profilePicUrl = profilePicResult.url;
    }
  }

  // 2. Upload Story Media (Photo or Video) to Cloudinary (if provided)
  if (storyFile) {
    const storyResult = await uploadMediaToCloudinary(storyFile);
    if (storyResult && storyResult.url) {
      if (storyResult.resourceType === 'video') {
        videoUrl = storyResult.url;
        videoThumbnail = storyResult.thumbnail;
      } else {
        storyPhotoUrl = storyResult.url;
      }
    } else {
      console.warn('Cloudinary upload did not complete, falling back to default media assets.');
    }
  }

  // 3. Direct Supabase Insert for Review Text, Ratings & Media URLs
  const sb = getSupabase();
  if (sb) {
    try {
      const isVideo = testimonial.type === 'video' || !!videoUrl;
      const isPhotoStory = !isVideo && !!storyPhotoUrl;

      // In the database:
      // If photo story exists, photo_url stores: storyPhotoUrl (or storyPhotoUrl|profilePicUrl if both exist)
      // If video story, video_url stores videoUrl, and photo_url stores profilePicUrl (or videoThumbnail)
      // If text review with profile picture, photo_url stores profilePicUrl
      let finalPhotoUrl = profilePicUrl;
      if (isPhotoStory) {
        finalPhotoUrl = (storyPhotoUrl && profilePicUrl && storyPhotoUrl !== profilePicUrl)
          ? `${storyPhotoUrl}|${profilePicUrl}`
          : (storyPhotoUrl || profilePicUrl);
      } else if (isVideo) {
        finalPhotoUrl = profilePicUrl || videoThumbnail;
      }

      const recordToInsert = {
        author: testimonial.author,
        location: testimonial.location,
        department: testimonial.department,
        attending_doctor: testimonial.attendingDoctor || null,
        rating: testimonial.rating || 5,
        type: isVideo ? 'video' : (isPhotoStory ? 'photo' : 'text'),
        quote: testimonial.quote,
        photo_url: finalPhotoUrl,
        video_url: isVideo ? videoUrl : null,
        status: 'approved',
        created_at: new Date().toISOString()
      };

      const { data, error: insertError } = await sb
        .from('testimonials')
        .insert([recordToInsert])
        .select();

      if (!insertError && data && data.length > 0) {
        const savedId = data[0].id;
        console.info('Testimonial successfully saved to Supabase:', data[0]);

        // Also save to localStorage for instant local access
        try {
          const localRecord = {
            ...testimonial,
            id: savedId,
            avatar: profilePicUrl,
            storyPhoto: storyPhotoUrl,
            videoUrl: recordToInsert.video_url,
            videoThumbnail: videoThumbnail || profilePicUrl
          };
          const existing = JSON.parse(localStorage.getItem(TESTIMONIALS_STORAGE_KEY) || '[]');
          existing.unshift(localRecord);
          localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(existing));
        } catch (storageErr) {
          console.warn('LocalStorage sync note:', storageErr);
        }

        return { success: true, mode: 'supabase_cloudinary', id: savedId, data: data[0] };
      } else if (insertError) {
        console.error('Supabase insert failed:', insertError);
        return { success: false, error: insertError.message || 'Database insert failed' };
      }
    } catch (err) {
      console.error('Supabase insert exception:', err);
      return { success: false, error: err.message };
    }
  }

  // 4. Local fallback (if Supabase credentials are not initialized)
  try {
    const localRecord = {
      ...testimonial,
      avatar: profilePicUrl,
      storyPhoto: storyPhotoUrl,
      videoUrl: videoUrl,
      videoThumbnail: videoThumbnail
    };
    const existing = JSON.parse(localStorage.getItem(TESTIMONIALS_STORAGE_KEY) || '[]');
    existing.unshift(localRecord);
    localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(existing));
    return { success: true, mode: 'local' };
  } catch (err) {
    console.error('Error saving testimonial locally:', err);
    return { success: false, error: err.message };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    SEED_TESTIMONIALS, 
    SUPABASE_CONFIG, 
    CLOUDINARY_CONFIG,
    uploadMediaToCloudinary,
    getCombinedTestimonials, 
    fetchAllTestimonialsAsync, 
    saveTestimonial 
  };
}
