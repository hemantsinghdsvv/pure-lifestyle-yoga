import re

new_cards = '''
        <!-- Master 1: Samresh Keshyap – CEO and Founder -->
        <div class="master-profile fade-up delay-1">
          <div class="master-img-wrapper">
            <img src="assets/images/master-samresh-new.jpg" alt="Master Samresh Keshyap – CEO and Founder, Pure Lifestyle Yoga" class="master-profile-img" loading="lazy" />
            <div class="master-tag-overlay">? CEO and Founder</div>
          </div>
          <div class="master-profile-body">
            <h3>Master Samresh Keshyap</h3>
            <p class="master-desc">HNI Yoga Specialist with over 20 years of experience across 17+ countries. An expert in Biomechanics &amp; Therapy, Master Samresh has transformed 1000s of clients with precision, blending ancient wisdom with modern science to deliver a global yoga experience at your home.</p>
          </div>
          <div class="master-specialization-footer">
            <span class="spec-label">Specialization</span>
            <span class="spec-text">Highly Experienced Yoga Therapist &amp; Mentor</span>
          </div>
        </div>

        <!-- Master 2: Ekta Shukla -->
        <div class="master-profile fade-up delay-2">
          <div class="master-img-wrapper">
            <img src="assets/images/master-ekta-new.jpg" alt="Ekta Shukla – Director and counsellor, Pure Lifestyle Yoga" class="master-profile-img" loading="lazy" />
            <div class="master-tag-overlay">? Director and counsellor</div>
          </div>
          <div class="master-profile-body">
            <h3>Ekta Shukla</h3>
            <p class="master-desc">Visionary leader integrating Clinical Psychology, Hypnotherapy, and Yoga Therapy. With an M.A. from D.S.V.V Haridwar and certification from S-VYASA Bengaluru, Ekta brings 10+ years of experience in holistic healing, specializing in stress management, emotional resilience, and personality development.</p>
          </div>
          <div class="master-specialization-footer">
            <span class="spec-label">Specialization</span>
            <span class="spec-text">Psychologist, Hypnotherapist, Mindfulness</span>
          </div>
        </div>

        <!-- Master 3: Divyansh Singh -->
        <div class="master-profile fade-up delay-3">
          <div class="master-img-wrapper">
            <img src="assets/images/master-divyansh-new.jpg" alt="Master Divyansh Singh – Premium Yoga Instructor, Pure Lifestyle Yoga" class="master-profile-img" loading="lazy" />
            <div class="master-tag-overlay">? Premium Yoga Instructor</div>
          </div>
          <div class="master-profile-body">
            <h3>Master Divyansh Singh</h3>
            <p class="master-desc">Specializing in Alignment-Based Yoga, Ashtanga, and Hatha Practice from D.S.V.V Haridwar, he learned Ashtanga from authorised teachers by Late. Sharath Jois (Sat Inder Khalsa, Digna Popat, Sachin Badoni). Divyansh combines traditional yogic sciences with modern biomechanics and therapeutic precision. He has treated more than 300+ individuals till date through both online and offline group and private classes, offering science-based methods for real, lasting transformation through luxury home sessions.</p>
          </div>
          <div class="master-specialization-footer">
            <span class="spec-label">Specialization</span>
            <span class="spec-text">Master's in Human Consciousness &amp; Yogic Sciences</span>
          </div>
        </div>

        <!-- Master 4: Parthiv Sharma -->
        <div class="master-profile fade-up delay-1">
          <div class="master-img-wrapper">
            <img src="assets/images/master-parthiv-new.jpg" alt="Parthiv Sharma – Premium Yoga Therapist, Pure Lifestyle Yoga" class="master-profile-img" loading="lazy" />
            <div class="master-tag-overlay">? Premium Yoga Therapist</div>
          </div>
          <div class="master-profile-body">
            <h3>Parthiv Sharma</h3>
            <p class="master-desc">A science-based practitioner from Dev Sanskriti Vishwavidyalaya, Haridwar, Parthiv specialises in Alignment-Based Yoga, Ashtanga &amp; Hatha Practice, Breathwork &amp; Pranayama, and Yoga Therapy &amp; Posture Correction. His approach combines traditional yoga with modern biomechanics, breath intelligence and therapeutic precision — designed for real, lasting transformation through luxury private &amp; home sessions.</p>
          </div>
          <div class="master-specialization-footer">
            <span class="spec-label">Specialization</span>
            <span class="spec-text">Master's in Yogic Sciences &amp; Human Consciousness</span>
          </div>
        </div>

        <!-- Master 5: Shailza Sharma -->
        <div class="master-profile fade-up delay-2">
          <div class="master-img-wrapper">
            <img src="assets/images/master-shailza-new.jpg" alt="Shailza Sharma – Yoga Instructor, Pure Lifestyle Yoga" class="master-profile-img" loading="lazy" />
            <div class="master-tag-overlay">? Yoga Instructor</div>
          </div>
          <div class="master-profile-body">
            <h3>Shailza Sharma</h3>
            <p class="master-desc">Shailza brings the philosophy of Expertise, Empathy, and Excellence to every session. Specialising in all levels from gentle to advanced, she offers refined guidance with a holistic approach to Mind, Body, and Soul. Her dedicated focus on women's health and specialised care makes her the ideal partner for your wellness journey — beautifully, precisely, consistently.</p>
          </div>
          <div class="master-specialization-footer">
            <span class="spec-label">Specialization</span>
            <span class="spec-text">Holistic Well-Being &amp; Women's Health Specialist</span>
          </div>
        </div>
'''

for file in ['masters.html', 'index.html']:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to replace the grid-3 content.
    if file == 'masters.html':
        pattern = r'(<!-- Master 1: .*?)(?=</div><!-- end grid -->)'
    else:
        pattern = r'(<!-- Master 1: .*?)(?=</div>\s*<div class="text-center fade-up delay-4")'

    content = re.sub(pattern, new_cards, content, flags=re.DOTALL)
    
    # Just in case, let's fix any indentation.
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
