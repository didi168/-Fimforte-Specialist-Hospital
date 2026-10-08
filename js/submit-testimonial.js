/**
 * FIMFORTE SPECIALIST HOSPITAL — TESTIMONIAL SUBMISSION CONTROLLER
 * Handles Patient Profile Picture (top), Story Photo/Video (bottom), Ratings & Storage
 */

document.addEventListener('DOMContentLoaded', () => {
  // Main Form Elements
  const form = document.getElementById('testimonialSubmitForm');
  const starButtons = document.querySelectorAll('.star-btn');
  const ratingInput = document.getElementById('selectedRating');
  const ratingLabel = document.getElementById('ratingLabel');

  // 1. Patient Profile Picture Elements (Top of form)
  const patientProfilePicInput = document.getElementById('patientProfilePicInput');
  const btnChooseProfilePic = document.getElementById('btnChooseProfilePic');
  const btnRemoveProfilePic = document.getElementById('btnRemoveProfilePic');
  const profileAvatarImg = document.getElementById('profileAvatarImg');
  const profileDefaultIcon = document.getElementById('profileDefaultIcon');

  let rawProfilePicFile = null;
  let uploadedProfilePicData = null;

  // 2. Story Media Tabs (Bottom of form: Story Photo vs Video Story)
  const tabPhotoBtn = document.getElementById('tabPhotoBtn');
  const tabVideoBtn = document.getElementById('tabVideoBtn');
  const photoPanel = document.getElementById('photoUploadPanel');
  const videoPanel = document.getElementById('videoUploadPanel');

  // Story Photo Upload Elements
  const photoDropzone = document.getElementById('photoDropzone');
  const photoFileInput = document.getElementById('photoFileInput');
  const photoPreviewContainer = document.getElementById('photoPreviewContainer');
  const photoPreviewImg = document.getElementById('photoPreviewImg');
  const removePhotoBtn = document.getElementById('removePhotoBtn');

  // Story Video Upload Elements
  const videoDropzone = document.getElementById('videoDropzone');
  const videoFileInput = document.getElementById('videoFileInput');
  const videoPreviewContainer = document.getElementById('videoPreviewContainer');
  const videoPreviewEl = document.getElementById('videoPreviewEl');
  const removeVideoBtn = document.getElementById('removeVideoBtn');

  // Success Modal
  const successModal = document.getElementById('submissionSuccessModal');
  const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');

  let activeMediaMode = 'photo'; // 'photo' | 'video'
  let uploadedStoryPhotoData = null;
  let uploadedStoryVideoData = null;
  let rawStoryPhotoFile = null;
  let rawStoryVideoFile = null;

  const RATING_DESCRIPTIONS = {
    1: '1.0 (Needs Improvement)',
    2: '2.0 (Fair Treatment)',
    3: '3.0 (Satisfactory Care)',
    4: '4.0 (Very Good Care)',
    5: '5.0 (Exceptional Care)'
  };

  // =========================================================================
  // 1. TOP SECTION: PATIENT PROFILE PICTURE (AVATAR)
  // =========================================================================
  if (btnChooseProfilePic && patientProfilePicInput) {
    btnChooseProfilePic.addEventListener('click', () => {
      patientProfilePicInput.click();
    });

    patientProfilePicInput.addEventListener('change', () => {
      if (patientProfilePicInput.files && patientProfilePicInput.files[0]) {
        handleProfilePicFile(patientProfilePicInput.files[0]);
      }
    });
  }

  function handleProfilePicFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, or WebP) for your profile picture.');
      return;
    }
    const maxBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxBytes) {
      alert('Profile picture size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    rawProfilePicFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedProfilePicData = e.target.result;
      if (profileAvatarImg) {
        profileAvatarImg.src = uploadedProfilePicData;
        profileAvatarImg.classList.add('show');
      }
      if (profileDefaultIcon) {
        profileDefaultIcon.style.display = 'none';
      }
      if (btnRemoveProfilePic) {
        btnRemoveProfilePic.classList.remove('hidden');
      }
    };
    reader.readAsDataURL(file);
  }

  function clearProfilePic() {
    rawProfilePicFile = null;
    uploadedProfilePicData = null;
    if (patientProfilePicInput) patientProfilePicInput.value = '';
    if (profileAvatarImg) {
      profileAvatarImg.src = '';
      profileAvatarImg.classList.remove('show');
    }
    if (profileDefaultIcon) {
      profileDefaultIcon.style.display = 'block';
    }
    if (btnRemoveProfilePic) {
      btnRemoveProfilePic.classList.add('hidden');
    }
  }

  if (btnRemoveProfilePic) {
    btnRemoveProfilePic.addEventListener('click', clearProfilePic);
  }

  // =========================================================================
  // 2. STAR RATING INTERACTIONS
  // =========================================================================
  starButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const rating = parseInt(btn.getAttribute('data-rating'), 10);
      ratingInput.value = rating;
      ratingLabel.textContent = RATING_DESCRIPTIONS[rating] || `${rating}.0`;

      starButtons.forEach(s => {
        const sRating = parseInt(s.getAttribute('data-rating'), 10);
        if (sRating <= rating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });

    btn.addEventListener('mouseenter', () => {
      const rating = parseInt(btn.getAttribute('data-rating'), 10);
      starButtons.forEach(s => {
        const sRating = parseInt(s.getAttribute('data-rating'), 10);
        if (sRating <= rating) {
          s.classList.add('hover-active');
        } else {
          s.classList.remove('hover-active');
        }
      });
    });

    btn.addEventListener('mouseleave', () => {
      starButtons.forEach(s => s.classList.remove('hover-active'));
    });
  });

  // =========================================================================
  // 3. BOTTOM SECTION: STORY MEDIA TABS (PHOTO VS VIDEO)
  // =========================================================================
  function switchMediaTab(mode) {
    activeMediaMode = mode;
    
    [tabPhotoBtn, tabVideoBtn].forEach(b => {
      if (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      }
    });
    [photoPanel, videoPanel].forEach(p => {
      if (p) {
        p.classList.remove('active');
        p.setAttribute('hidden', '');
      }
    });

    if (mode === 'photo' && tabPhotoBtn && photoPanel) {
      tabPhotoBtn.classList.add('active');
      tabPhotoBtn.setAttribute('aria-selected', 'true');
      photoPanel.classList.add('active');
      photoPanel.removeAttribute('hidden');
    } else if (mode === 'video' && tabVideoBtn && videoPanel) {
      tabVideoBtn.classList.add('active');
      tabVideoBtn.setAttribute('aria-selected', 'true');
      videoPanel.classList.add('active');
      videoPanel.removeAttribute('hidden');
    }
  }

  if (tabPhotoBtn) tabPhotoBtn.addEventListener('click', () => switchMediaTab('photo'));
  if (tabVideoBtn) tabVideoBtn.addEventListener('click', () => switchMediaTab('video'));

  // Story Photo Handling (Under 10MB)
  if (photoDropzone && photoFileInput) {
    photoDropzone.addEventListener('click', () => photoFileInput.click());

    ['dragenter', 'dragover'].forEach(eventName => {
      photoDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        photoDropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      photoDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        photoDropzone.classList.remove('dragover');
      });
    });

    photoDropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleStoryPhotoFile(e.dataTransfer.files[0]);
      }
    });

    photoFileInput.addEventListener('change', () => {
      if (photoFileInput.files && photoFileInput.files[0]) {
        handleStoryPhotoFile(photoFileInput.files[0]);
      }
    });
  }

  function handleStoryPhotoFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP) for your story photo.');
      return;
    }
    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxBytes) {
      alert('Story photo size exceeds 10MB limit. Please choose a smaller image.');
      return;
    }

    rawStoryPhotoFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedStoryPhotoData = e.target.result;
      photoPreviewImg.src = uploadedStoryPhotoData;
      photoDropzone.classList.add('hidden');
      photoPreviewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }

  function clearStoryPhotoSelection() {
    uploadedStoryPhotoData = null;
    rawStoryPhotoFile = null;
    if (photoFileInput) photoFileInput.value = '';
    if (photoPreviewImg) photoPreviewImg.src = '';
    if (photoPreviewContainer) photoPreviewContainer.classList.add('hidden');
    if (photoDropzone) photoDropzone.classList.remove('hidden');
  }

  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', clearStoryPhotoSelection);
  }

  // Story Video Handling (Under 30MB)
  if (videoDropzone && videoFileInput) {
    videoDropzone.addEventListener('click', () => videoFileInput.click());

    ['dragenter', 'dragover'].forEach(eventName => {
      videoDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        videoDropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      videoDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        videoDropzone.classList.remove('dragover');
      });
    });

    videoDropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleStoryVideoFile(e.dataTransfer.files[0]);
      }
    });

    videoFileInput.addEventListener('change', () => {
      if (videoFileInput.files && videoFileInput.files[0]) {
        handleStoryVideoFile(videoFileInput.files[0]);
      }
    });
  }

  function handleStoryVideoFile(file) {
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file (MP4, MOV, WebM).');
      return;
    }
    const maxBytes = 30 * 1024 * 1024; // 30MB
    if (file.size > maxBytes) {
      alert('Video file size exceeds 30MB limit. Consider trimming the clip to under 60 seconds.');
      return;
    }

    rawStoryVideoFile = file;
    const videoObjUrl = URL.createObjectURL(file);
    uploadedStoryVideoData = videoObjUrl;
    videoPreviewEl.src = videoObjUrl;
    videoDropzone.classList.add('hidden');
    videoPreviewContainer.classList.remove('hidden');
  }

  function clearStoryVideoSelection() {
    if (uploadedStoryVideoData && uploadedStoryVideoData.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedStoryVideoData);
    }
    uploadedStoryVideoData = null;
    rawStoryVideoFile = null;
    if (videoFileInput) videoFileInput.value = '';
    if (videoPreviewEl) videoPreviewEl.src = '';
    if (videoPreviewContainer) videoPreviewContainer.classList.add('hidden');
    if (videoDropzone) videoDropzone.classList.remove('hidden');
  }

  if (removeVideoBtn) {
    removeVideoBtn.addEventListener('click', clearStoryVideoSelection);
  }

  // =========================================================================
  // 4. FORM SUBMISSION
  // =========================================================================
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = document.getElementById('patientFullName').value.trim();
      const location = document.getElementById('patientLocation').value.trim();
      const anonymize = document.getElementById('anonymizeName').checked;
      const department = document.getElementById('departmentVisited').value;
      const attendingDoctor = document.getElementById('attendingDoctor').value.trim();
      const rating = parseInt(ratingInput.value, 10) || 5;
      const quote = document.getElementById('testimonialText').value.trim();
      const consent = document.getElementById('consentCheck').checked;

      if (!fullName || !location || !department || !quote) {
        alert('Please fill out all required fields marked with an asterisk (*).');
        return;
      }

      if (quote.length < 20) {
        alert('Please share a few more details about your experience (at least 20 characters).');
        return;
      }

      if (!consent) {
        alert('Please review and check the Patient Publication Authorization box to proceed.');
        return;
      }

      // Format author display name
      let displayName = fullName;
      if (anonymize) {
        const parts = fullName.split(' ');
        if (parts.length > 1) {
          displayName = `${parts[0]} ${parts[1][0].toUpperCase()}.`;
        } else {
          displayName = `${parts[0]} (Patient)`;
        }
      }

      // Determine story media format & file
      let itemType = 'text';
      let videoUrl = null;
      let rawStoryFile = null;

      if (activeMediaMode === 'video' && rawStoryVideoFile) {
        itemType = 'video';
        rawStoryFile = rawStoryVideoFile;
        videoUrl = uploadedStoryVideoData;
      } else if (activeMediaMode === 'photo' && rawStoryPhotoFile) {
        itemType = 'photo';
        rawStoryFile = rawStoryPhotoFile;
      }

      // Build structured testimonial record
      const newTestimonial = {
        id: 'user-' + Date.now(),
        author: displayName,
        location: location,
        department: department,
        attendingDoctor: attendingDoctor || null,
        rating: rating,
        type: itemType,
        verified: true,
        avatar: uploadedProfilePicData || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        storyPhoto: uploadedStoryPhotoData || null,
        videoUrl: videoUrl,
        videoThumbnail: uploadedStoryPhotoData || null,
        quote: quote,
        date: 'Just now'
      };

      // Loading state on button with descriptive progress
      const submitBtn = document.getElementById('submitReviewBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        if (itemType === 'video' && rawStoryFile) {
          submitBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up fa-fade"></i> <span>Uploading Video Story & Publishing...</span>';
        } else if (rawStoryFile || rawProfilePicFile) {
          submitBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up fa-fade"></i> <span>Uploading Pictures & Publishing...</span>';
        } else {
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Publishing Testimony...</span>';
        }
      }

      let saveResult = { success: false };
      try {
        if (typeof saveTestimonial === 'function') {
          saveResult = await saveTestimonial(newTestimonial, {
            profilePicFile: rawProfilePicFile,
            storyFile: rawStoryFile
          });
        } else {
          saveResult = { success: false, error: 'Storage engine not loaded.' };
        }
      } catch (saveErr) {
        saveResult = { success: false, error: saveErr.message };
      }

      // Re-enable button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>Submit My Testimony</span>';
      }

      // Handle submission result
      if (saveResult && saveResult.success) {
        const successTitle = document.getElementById('successTitle');
        const successMessage = document.getElementById('successMessage');

        if (successTitle) {
          successTitle.textContent = `Thank You, ${displayName}!`;
        }
        if (successMessage) {
          if (saveResult.mode === 'supabase_cloudinary') {
            successMessage.textContent = 'Your patient testimony, profile picture, and media have been successfully uploaded to the cloud and published live on the Fimforte Specialist Hospital homepage.';
          } else {
            successMessage.textContent = 'Your patient testimony has been received and stored! It is featured on the Fimforte Specialist Hospital homepage.';
          }
        }

        if (successModal) {
          successModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        } else {
          alert('Thank you! Your testimonial has been received and published.');
          window.location.href = 'index.html#testimonials';
        }

        // Cleanly reset form, profile picture, and media previews
        form.reset();
        clearProfilePic();
        clearStoryPhotoSelection();
        clearStoryVideoSelection();
        switchMediaTab('photo');
        ratingInput.value = '5';
        ratingLabel.textContent = '5.0 (Exceptional Care)';
        starButtons.forEach(s => s.classList.add('active'));

      } else {
        const errMsg = (saveResult && saveResult.error) ? saveResult.error : 'Network or storage failure.';
        console.error('Submission failed:', saveResult);
        alert('Could not submit testimony: ' + errMsg + '\nPlease verify your internet connection and try again.');
      }
    });
  }

  // =========================================================================
  // 5. SUCCESS MODAL DISMISSAL
  // =========================================================================
  function closeSuccessModal() {
    if (successModal) {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeSuccessModalBtn) {
    closeSuccessModalBtn.addEventListener('click', closeSuccessModal);
  }

  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        closeSuccessModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal && successModal.classList.contains('active')) {
      closeSuccessModal();
    }
  });
});
