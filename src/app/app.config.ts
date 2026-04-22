import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  LucideAngularModule,
  Home, Search, ShoppingCart, User, Bell, ChevronRight, ChevronLeft, ChevronDown,
  Star, MapPin, Clock, Package, TestTube2, Activity, Heart, Shield, Zap, Check,
  Plus, Minus, X, Filter, ArrowLeft, ArrowRight, Download, Share2, Phone,
  FileText, Settings, LogOut, LayoutDashboard, Users, ClipboardList, TrendingUp,
  BarChart2, Upload, Edit2, Trash2, Eye, CheckCircle, AlertCircle, Loader2,
  Calendar, FlaskConical, Microscope, Thermometer, Pill, Dna, Baby, BrainCircuit,
  CreditCard, Wallet, Banknote, ReceiptText, IndianRupee, Tag, Percent,
  Menu, Info, RefreshCw, Send, MessageCircle, HelpCircle, Stethoscope,
  Hospital, Syringe, HeartPulse, Building2, Award, Sparkles, ArrowUp,
  WifiOff, SlidersHorizontal, MoreHorizontal, QrCode, Camera, Image,
  UserCheck, UserPlus, ChevronUp, Lock, Mail, ShieldCheck, Flame
} from 'lucide-angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })),
    provideAnimationsAsync(),
    importProvidersFrom(LucideAngularModule.pick({
      Home, Search, ShoppingCart, User, Bell, ChevronRight, ChevronLeft, ChevronDown,
      Star, MapPin, Clock, Package, TestTube2, Activity, Heart, Shield, Zap, Check,
      Plus, Minus, X, Filter, ArrowLeft, ArrowRight, Download, Share2, Phone,
      FileText, Settings, LogOut, LayoutDashboard, Users, ClipboardList, TrendingUp,
      BarChart2, Upload, Edit2, Trash2, Eye, CheckCircle, AlertCircle, Loader2,
      Calendar, FlaskConical, Microscope, Thermometer, Pill, Dna, Baby, BrainCircuit,
      CreditCard, Wallet, Banknote, ReceiptText, IndianRupee, Tag, Percent,
      Menu, Info, RefreshCw, Send, MessageCircle, HelpCircle, Stethoscope,
      Hospital, Syringe, HeartPulse, Building2, Award, Sparkles, ArrowUp,
      WifiOff, SlidersHorizontal, MoreHorizontal, QrCode, Camera, Image,
      UserCheck, UserPlus, ChevronUp, Lock, Mail, ShieldCheck, Flame
    }))
  ]
};
