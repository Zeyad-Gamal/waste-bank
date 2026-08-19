module.exports = {

  // =========================
  // Authentication
  // =========================

  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'رقم الهاتف أو كلمة المرور غير صحيحة',
  },

  EMAIL_NOT_VERIFIED: {
    code: 'EMAIL_NOT_VERIFIED',
    message: 'يرجى تأكيد البريد الإلكتروني أولاً',
  },

  ACCOUNT_NOT_ACTIVE: {
    code: 'ACCOUNT_NOT_ACTIVE',
    message: 'الحساب غير مفعل',
  },

  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'غير مصرح لك بتنفيذ هذا الطلب',
  },

  INVALID_TOKEN: {
    code: 'INVALID_TOKEN',
    message: 'رمز الدخول غير صالح أو انتهت صلاحيته',
  },

  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    message: 'انتهت صلاحية رمز الدخول',
  },


  // =========================
  // User
  // =========================

  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'المستخدم غير موجود',
  },

  PHONE_ALREADY_EXISTS: {
    code: 'PHONE_ALREADY_EXISTS',
    message: 'رقم الهاتف مستخدم بالفعل',
  },

  EMAIL_ALREADY_EXISTS: {
    code: 'EMAIL_ALREADY_EXISTS',
    message: 'البريد الإلكتروني مستخدم بالفعل',
  },

  INDUSTRIAL_NUMBER_ALREADY_EXISTS: {
    code: 'INDUSTRIAL_NUMBER_ALREADY_EXISTS',
    message: 'رقم التسجيل الصناعي مسجل بالفعل',
  },


  // =========================
  // Password
  // =========================

  INVALID_CURRENT_PASSWORD: {
    code: 'INVALID_CURRENT_PASSWORD',
    message: 'كلمة المرور الحالية غير صحيحة',
  },

  NEW_PASSWORD_SAME_AS_OLD: {
    code: 'NEW_PASSWORD_SAME_AS_OLD',
    message: 'كلمة المرور الجديدة يجب أن تكون مختلفة عن كلمة المرور الحالية',
  },

  PASSWORD_UPDATE_SUCCESS: {
    code: 'PASSWORD_UPDATE_SUCCESS',
    message: 'تم تحديث كلمة المرور بنجاح',
  },


  // =========================
  // Email Verification
  // =========================

    EMAIL_REQUIRED: {
    code: 'EMAIL_REQUIRED',
    message: 'البريد الإلكتروني مطلوب',
  },

  EMAIL_ALREADY_VERIFIED: {
    code: 'EMAIL_ALREADY_VERIFIED',
    message: 'البريد الإلكتروني مؤكد بالفعل',
  },

  VERIFICATION_TOKEN_REQUIRED: {
    code: 'VERIFICATION_TOKEN_REQUIRED',
    message: 'رمز تأكيد البريد الإلكتروني مطلوب',
  },

  INVALID_VERIFICATION_TOKEN: {
    code: 'INVALID_VERIFICATION_TOKEN',
    message: 'رمز تأكيد البريد الإلكتروني غير صالح أو تم استخدامه من قبل',
  },

  VERIFICATION_TOKEN_EXPIRED: {
    code: 'VERIFICATION_TOKEN_EXPIRED',
    message: 'انتهت صلاحية رمز تأكيد البريد الإلكتروني',
  },

  EMAIL_VERIFIED_SUCCESS: {
    code: 'EMAIL_VERIFIED_SUCCESS',
    message: 'تم تأكيد البريد الإلكتروني بنجاح',
  },

  VERIFICATION_EMAIL_SENT: {
    code: 'VERIFICATION_EMAIL_SENT',
    message: 'تم إرسال رسالة تأكيد البريد الإلكتروني',
  },






  // =========================
  // Farmer
  // =========================

  FARMER_MUST_BE_INACTIVE_TO_DELETE: {
  code: 'FACTORY_MUST_BE_INACTIVE_TO_DELETE',
  message: 'لا يمكن حذف الفلاح إلا إذا كان غير نشط',
},





  // =========================
  // Offer
  // =========================

  OFFER_NOT_FOUND: {
    code: 'OFFER_NOT_FOUND',
    message: 'العرض غير موجود',
  },

  INVALID_OFFER_STATUS: {
    code: 'INVALID_OFFER_STATUS',
    message: 'حالة العرض غير صالحة لتنفيذ هذه العملية',
  },



  // =========================
  // Factory
  // =========================

  FACTORY_MUST_BE_INACTIVE_TO_DELETE: {
  code: 'FACTORY_MUST_BE_INACTIVE_TO_DELETE',
  message: 'لا يمكن حذف المصنع إلا إذا كان غير نشط',
},


  // =========================
  // Factory Request
  // =========================

  FACTORY_REQUEST_NOT_FOUND: {
    code: 'FACTORY_REQUEST_NOT_FOUND',
    message: 'طلب المصنع غير موجود',
  },

  INVALID_FACTORY_REQUEST_STATUS: {
    code: 'INVALID_FACTORY_REQUEST_STATUS',
    message: 'حالة طلب المصنع غير صالحة لتنفيذ هذه العملية',
  },


  FACTORY_REQUEST_CANCELLED: {
    code: 'FACTORY_REQUEST_CANCELLED',
    message: 'تم إلغاء هذه العملية',
  },


  // =========================
  // Purchase
  // =========================

  PURCHASE_NOT_FOUND: {
    code: 'PURCHASE_NOT_FOUND',
    message: 'عملية الشراء غير موجودة',
  },

  INVALID_PURCHASE_STATUS: {
    code: 'INVALID_PURCHASE_STATUS',
    message: 'حالة عملية الشراء غير صالحة لتنفيذ هذه العملية',
  },








  // =========================
// Sales
// =========================

SALE_NOT_FOUND: {
  code: 'SALE_NOT_FOUND',
  message: 'عملية البيع غير موجودة',
},

INVALID_SALE_STATUS: {
  code: 'INVALID_SALE_STATUS',
  message: 'حالة عملية البيع غير صالحة لتنفيذ هذه العملية',
},

INSUFFICIENT_INVENTORY_FOR_SALE: {
  code: 'INSUFFICIENT_INVENTORY_FOR_SALE',
  message: 'الكمية المطلوبة للبيع غير متوفرة في المخزون',
},

INVALID_SALE_QUANTITY: {
  code: 'INVALID_SALE_QUANTITY',
  message: 'كمية البيع غير صالحة',
},

INVALID_SALE_PRICE: {
  code: 'INVALID_SALE_PRICE',
  message: 'سعر البيع غير صالح',
},

FACTORY_NOT_FOUND_FOR_SALE: {
  code: 'FACTORY_NOT_FOUND_FOR_SALE',
  message: 'المصنع المطلوب للبيع غير موجود',
},

SALE_CANNOT_BE_CANCELLED: {
  code: 'SALE_CANNOT_BE_CANCELLED',
  message: 'لا يمكن إلغاء عملية البيع في حالتها الحالية',
},

SALE_CANNOT_BE_COMPLETED: {
  code: 'SALE_CANNOT_BE_COMPLETED',
  message: 'لا يمكن إتمام عملية البيع في حالتها الحالية',
},




  // =========================
  // Shipment
  // =========================

  SHIPMENT_NOT_FOUND: {
    code: 'SHIPMENT_NOT_FOUND',
    message: 'الشحنة غير موجودة',
  },

  INVALID_SHIPMENT_STATUS: {
    code: 'INVALID_SHIPMENT_STATUS',
    message: 'حالة الشحنة غير صالحة لتنفيذ هذه العملية',
  },

    INVALID_SHIPMENT_TYPE: {
    code: 'INVALID_SHIPMENT_TYPE',
    message: 'نوع الشحنه خاطئ',
  },



  // =========================
  // Inventory
  // =========================

INVENTORY_NOT_FOUND: {
  code: 'INVENTORY_NOT_FOUND',
  message: 'المخزون غير موجود',
},

INVALID_INVENTORY_STATUS: {
  code: 'INVALID_INVENTORY_STATUS',
  message: 'حالة المخزون غير صالحة لتنفيذ هذه العملية',
},

INSUFFICIENT_INVENTORY: {
  code: 'INSUFFICIENT_INVENTORY',
  message: 'الكمية المطلوبة غير متوفرة في المخزون',
},


  // =========================
  // Category
  // =========================

  CATEGORY_NOT_FOUND: {
    code: 'CATEGORY_NOT_FOUND',
    message: 'التصنيف غير موجود',
  },





// =========================
// Notifications
// =========================

NOTIFICATION_NOT_FOUND: {
  code: 'NOTIFICATION_NOT_FOUND',
  message: 'الإشعار غير موجود',
},

NOTIFICATION_ALREADY_READ: {
  code: 'NOTIFICATION_ALREADY_READ',
  message: 'الإشعار مقروء بالفعل',
},

INVALID_NOTIFICATION_TYPE: {
  code: 'INVALID_NOTIFICATION_TYPE',
  message: 'نوع الإشعار غير صالح',
},








// =========================
// Ratings
// =========================

RATING_NOT_FOUND: {
  code: 'RATING_NOT_FOUND',
  message: 'التقييم غير موجود',
},

INVALID_RATING_VALUE: {
  code: 'INVALID_RATING_VALUE',
  message: 'قيمة التقييم غير صالحة',
},

RATING_ALREADY_EXISTS: {
  code: 'RATING_ALREADY_EXISTS',
  message: 'تم إضافة التقييم بالفعل',
},

CANNOT_RATE_THIS_RESOURCE: {
  code: 'CANNOT_RATE_THIS_RESOURCE',
  message: 'لا يمكنك تقييم هذا العنصر',
},

RATING_NOT_ALLOWED: {
  code: 'RATING_NOT_ALLOWED',
  message: 'غير مسموح لك بإضافة تقييم',
},



  // =========================
  // General
  // =========================

  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'البيانات المرسلة غير صحيحة',
  },

  RESOURCE_NOT_FOUND: {
    code: 'RESOURCE_NOT_FOUND',
    message: 'العنصر المطلوب غير موجود',
  },

  INVALID_RESOURCE_VALUE: {
  code: 'INVALID_RESOURCE_VALUE',
  message: 'قيمة العنصر غير صالحة',
},

  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: 'ليس لديك صلاحية لتنفيذ هذه العملية',
  },

  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'حدث خطأ غير متوقع في الخادم',
  },

};