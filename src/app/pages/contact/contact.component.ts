import { Component, OnInit, Signal } from '@angular/core';
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { SharedService } from '../../services/shared.service';
import { SafeurlPipe } from '../../pipes/safeurl.pipe';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import emailjs from 'emailjs-com';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [BreadcrumbComponent, SafeurlPipe, CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  contactInfo: Signal<any|null>;
  contactForm: FormGroup;
  loading = false;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private seoService: SeoService
  ) {
    this.contactInfo = this.sharedService.getBrandInfo();
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: 'Contact BCAProjectSathi - Get Help with Your BCA Projects',
      description: 'Contact BCAProjectSathi for BCA project assistance, web development help, documentation support, and academic guidance. Call +977-9869550743 or send us a message.',
      keywords: 'contact BCAProjectSathi, BCA project help, academic support contact, web development assistance, project consultation Nepal',
      url: 'https://bcaprojectsathi.com/contact',
      image: 'https://bcaprojectsathi.com/assets/icons/bcaprojectsathi-logo.png',
      type: 'website'
    });
    
    // Generate ContactPage Structured Data
    const contactPageData = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact BCAProjectSathi",
      "description": "Get in touch with BCAProjectSathi for BCA project assistance and academic support",
      "url": "https://bcaprojectsathi.com/contact",
      "mainEntity": {
        "@type": "Organization",
        "name": "BCAProjectSathi",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+977-9869550743",
          "contactType": "Customer Service",
          "availableLanguage": ["English", "Nepali"],
          "areaServed": "Nepal"
        }
      }
    };

    this.seoService.generateStructuredData('contact', contactPageData);
  }

  get f() { return this.contactForm.controls; }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.toastr.error('Please fill all fields correctly.');
      return;
    }
    this.loading = true;
    emailjs.send(
      'service_hpithoj',
      'template_fomj1l6',
      this.contactForm.value,
      'yEa-6E6vYrvytShLP'
    ).then(() => {
      this.toastr.success('Email sent successfully. We will get back to you shortly.');
      this.contactForm.reset();
      this.loading = false;
    }).catch(() => {
      this.toastr.error('Email failed to send. Please try again later.');
      this.loading = false;
    });
  }
}