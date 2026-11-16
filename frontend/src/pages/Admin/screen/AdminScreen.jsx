import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminApi } from '../api/adminScreenApi';
import {
  INITIAL_DESTINATION_FORM,
  INITIAL_PROVIDER_FORM,
  WORKSPACE_LINKS,
  buildCatalogTabsMeta,
} from '../models/adminModel';
import { AdminHeader, AdminSidebar } from '../components/AdminHeaderAndSidebar';
import { AdminOverviewTab, AdminReportsTab } from '../components/OverviewAndReportsTabs';
import { AdminCatalogTab } from '../components/CatalogTab';
import {
  AdminApplicationsTab,
  AdminBookingsTab,
  AdminDisputesTab,
  AdminProvidersTab,
  AdminUsersTab,
} from '../components/PartnersAndOpsTabs';
import {
  AdminAuditTab,
  AdminCommissionsTab,
  AdminPayoutsTab,
  AdminSettingsTab,
  AdminSettlementsTab,
} from '../components/FinanceAndGovernanceTabs';
import {
  AllScreensModal,
  ApplicationReviewModal,
  CommissionRuleModal,
  DestinationEditorModal,
  DisputeResolutionModal,
  HelpModal,
  NewProviderModal,
} from '../components/AdminModals';

export default function AdminScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const setActiveTab = useCallback(
    (tabId) => {
      setSearchParams({ tab: tabId });
    },
    [setSearchParams]
  );

  const currentMeta =
    WORKSPACE_LINKS.find((item) => item.id === activeTab) || WORKSPACE_LINKS[0];

  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const [overview, setOverview] = useState(null);
  const [providers, setProviders] = useState([]);
  const [applications, setApplications] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [finance, setFinance] = useState(null);
  const [catalog, setCatalog] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [settingsData, setSettingsData] = useState(null);

  const [providerFilter, setProviderFilter] = useState({ status: 'all', search: '' });
  const [appFilter, setAppFilter] = useState({ status: 'all', search: '' });
  const [userFilter, setUserFilter] = useState({ role: 'all', status: 'all', search: '' });
  const [bookingFilter, setBookingFilter] = useState({ kind: 'all', status: 'all', search: '' });
  const [disputeFilter, setDisputeFilter] = useState({ status: 'all', priority: 'all', search: '' });
  const [auditSearch, setAuditSearch] = useState('');
  const [catalogSubTab, setCatalogSubTab] = useState('destinations');
  const [destFilter, setDestFilter] = useState('all');
  const [destSearch, setDestSearch] = useState('');

  const [showAllScreensModal, setShowAllScreensModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const [showNewProviderModal, setShowNewProviderModal] = useState(false);
  const [newProviderForm, setNewProviderForm] = useState(INITIAL_PROVIDER_FORM);

  const [selectedDispute, setSelectedDispute] = useState(null);
  const [disputeReply, setDisputeReply] = useState('');
  const [disputeStatusNext, setDisputeStatusNext] = useState('');
  const [disputePriorityNext, setDisputePriorityNext] = useState('');

  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [commissionForm, setCommissionForm] = useState({
    bookingKind: 'HOTEL',
    name: '',
    ratePercent: '12',
    replaceRuleId: '',
  });

  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [editingDestinationId, setEditingDestinationId] = useState(null);
  const [destinationForm, setDestinationForm] = useState(INITIAL_DESTINATION_FORM);

  const [faqForm, setFaqForm] = useState({
    category: 'GENERAL',
    question: '',
    answerMarkdown: '',
  });

  const showToast = useCallback((type, text) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  }, []);

  const fetchAdminData = useCallback(async () => {
    const [ovRes, provRes, appRes, usrRes, bkRes, dispRes, finRes, catRes, audRes, setRes] =
      await Promise.all([
        adminApi.getOverview(),
        adminApi.getProviders(providerFilter),
        adminApi.getApplications(appFilter),
        adminApi.getUsers(userFilter),
        adminApi.getBookings(bookingFilter),
        adminApi.getDisputes(disputeFilter),
        adminApi.getFinance(),
        adminApi.getCatalog(),
        adminApi.getAuditLogs({ search: auditSearch }),
        adminApi.getSettings(),
      ]);

    return {
      overview: ovRes.data,
      providers: provRes.data.providers || [],
      applications: appRes.data.applications || [],
      usersList: usrRes.data.users || [],
      bookings: bkRes.data.bookings || [],
      disputes: dispRes.data.disputes || [],
      finance: finRes.data,
      catalog: catRes.data,
      auditLogs: audRes.data.logs || [],
      settingsData: setRes.data,
    };
  }, [providerFilter, appFilter, userFilter, bookingFilter, disputeFilter, auditSearch]);

  const applyBundle = useCallback((bundle) => {
    setOverview(bundle.overview);
    setProviders(bundle.providers);
    setApplications(bundle.applications);
    setUsersList(bundle.usersList);
    setBookings(bundle.bookings);
    setDisputes(bundle.disputes);
    setFinance(bundle.finance);
    setCatalog(bundle.catalog);
    setAuditLogs(bundle.auditLogs);
    setSettingsData(bundle.settingsData);
  }, []);

  const loadAllAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const bundle = await fetchAdminData();
      applyBundle(bundle);
    } catch (err) {
      showToast('error', err.message || 'تعذر تحميل بيانات لوحة التحكم.');
    } finally {
      setLoading(false);
    }
  }, [fetchAdminData, applyBundle, showToast]);

  useEffect(() => {
    let active = true;
    fetchAdminData()
      .then((bundle) => {
        if (active) applyBundle(bundle);
      })
      .catch((err) => {
        if (active) showToast('error', err.message || 'تعذر تحميل بيانات لوحة التحكم.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [fetchAdminData, applyBundle, showToast]);

  const handleReviewApplication = async (decisionStatus) => {
    if (!selectedApp) return;
    setActionBusy(true);
    try {
      await adminApi.reviewApplication(selectedApp.id, {
        status: decisionStatus,
        decisionNotes: reviewNotes,
      });
      showToast(
        'success',
        decisionStatus === 'approved'
          ? `تم اعتماد شريك الخدمة (${selectedApp.trade_name}) وتفعيل حسابه بنجاح.`
          : decisionStatus === 'rejected'
          ? 'تم رفض طلب الانضمام وتسجيل الملاحظات.'
          : 'تم تحويل الطلب لاستكمال البيانات وإشعار الشريك.'
      );
      setSelectedApp(null);
      setReviewNotes('');
      await loadAllAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionBusy(false);
    }
  };

  const handleCreateProvider = async (e) => {
    e.preventDefault();
    setActionBusy(true);
    try {
      await adminApi.createProvider(newProviderForm);
      showToast('success', 'تمت إضافة شريك الخدمة الجديد وإنشاء ملف المراجعة بنجاح.');
      setShowNewProviderModal(false);
      setNewProviderForm(INITIAL_PROVIDER_FORM);
      await loadAllAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionBusy(false);
    }
  };

  const handleToggleProviderStatus = async (providerId, nextStatus) => {
    setActionBusy(true);
    try {
      await adminApi.updateProvider(providerId, { status: nextStatus });
      showToast('success', `تم تحديث حالة الشريك إلى (${nextStatus}).`);
      await loadAllAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionBusy(false);
    }
  };

  const handleUpdateUser = async (userId, patch) => {
    setActionBusy(true);
    try {
      await adminApi.updateUser(userId, patch);
      showToast('success', 'تم تحديث صلاحيات وحالة المستخدم بنجاح.');
      await loadAllAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionBusy(false);
    }
  };

  const handleUpdateDispute = async (e) => {
    e.preventDefault();
    if (!selectedDispute) return;
    setActionBusy(true);
    try {
      await adminApi.updateDispute(selectedDispute.id, {
        status: disputeStatusNext || selectedDispute.status,
        priority: disputePriorityNext || selectedDispute.priority,
        replyMessage: disputeReply,
      });
      showToast('success', 'تم تحديث حالة التذكرة وإرسال رد الإدارة للعميل.');
      setDisputeReply('');
      setSelectedDispute(null);
      await loadAllAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionBusy(false);
    }
  };

  const handleCreateCommissionRule = async (e) => {
    e.preventDefault();
    setActionBusy(true);
    try {
      const rateBps = Math.round(Number(commissionForm.ratePercent) * 100);
      await adminApi.createCommissionRule({
        bookingKind: commissionForm.bookingKind,
        name: commissionForm.name,
        rateBps,
        replaceRuleId: commissionForm.replaceRuleId || undefined,
      });
      showToast('success', 'تم حفظ وتفعيل قاعدة العمولة الجديدة بنجاح.');
      setShowCommissionModal(false);
      setCommissionForm({ bookingKind: 'HOTEL', name: '', ratePercent: '12', replaceRuleId: '' });
      await loadAllAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionBusy(false);
    }
  };

  const handleToggleRule = async (rule) => {
    setActionBusy(true);
    try {
      await adminApi.toggleCommissionRule(rule.id, { isActive: !rule.is_active });
      showToast('success', 'تم تحديث حالة تفعيل قاعدة العمولة.');
      await loadAllAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionBusy(false);
    }
  };

  const handleSettlementTransition = async (settlementId, status) => {
    setActionBusy(true);
    try {
      await adminApi.updateSettlementStatus(settlementId, { status });
      showToast(
        'success',
        status === 'approved'
          ? 'تم اعتماد التسوية المالية وأصبحت جاهزة لإصدار التحويل البنكي.'
          : 'تم تحديث حالة التسوية المالية بنجاح.'
      );
      await loadAllAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionBusy(false);
    }
  };

  const handleCreatePayout = async (settlement) => {
    setActionBusy(true);
    try {
      await adminApi.createPayout({
        settlementId: settlement.id,
        amountMinor: settlement.available_minor,
      });
      showToast('success', `تم إصدار أمر تحويل بنكي للشريك (${settlement.provider_name}) بنجاح.`);
      setActiveTab('payouts');
      await loadAllAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionBusy(false);
    }
  };

  const handleUpdatePayout = async (payoutId, status) => {
    setActionBusy(true);
    try {
      await adminApi.updatePayoutStatus(payoutId, { status });
      showToast(
        'success',
        status === 'succeeded'
          ? 'تم تأكيد التحويل البنكي وتوثيق الرقم المرجعي بنجاح.'
          : 'تم تحديث حالة التحويل المالي.'
      );
      await loadAllAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionBusy(false);
    }
  };

  const openNewDestinationModal = () => {
    setEditingDestinationId(null);
    setDestinationForm({
      ...INITIAL_DESTINATION_FORM,
      displayOrder: (catalog?.destinations?.length || 4) + 1,
    });
    setShowDestinationModal(true);
  };

  const openEditDestinationModal = (dest) => {
    setEditingDestinationId(dest.id);
    setDestinationForm({
      nameAr: dest.name_ar || '',
      nameEn: dest.name_en || '',
      countryLabelAr: dest.country_label_ar || 'مصر',
      tagsAr: dest.tags_ar || 'ثقافة • تاريخ • سياحة',
      descriptionAr: dest.description_ar || '',
      categoryLabelAr: dest.category_label_ar || 'معالم',
      visitorsText: dest.visitors_text || '+12K',
      rating: String(dest.rating || '4.8'),
      ctaLabelAr: dest.cta_label_ar || 'استكشف الآن',
      imageUrl: dest.image_url || 'cairo',
      displayOrder: Number(dest.display_order || 1),
      isFeatured: Boolean(dest.is_featured),
      status: dest.status || 'active',
      kind: dest.kind || 'city',
    });
    setShowDestinationModal(true);
  };

  const handleSaveDestination = async (e) => {
    e.preventDefault();
    setActionBusy(true);
    try {
      const payload = {
        ...destinationForm,
        rating: Number(destinationForm.rating) || 4.8,
        displayOrder: Number(destinationForm.displayOrder) || 1,
      };
      if (editingDestinationId) {
        await adminApi.updateDestination(editingDestinationId, payload);
        showToast(
          'success',
          `تم تحديث بيانات الوجهة (${destinationForm.nameAr}) ومزامنتها مع الصفحة الرئيسية بنجاح.`
        );
      } else {
        await adminApi.createDestination(payload);
        showToast(
          'success',
          `تمت إضافة الوجهة (${destinationForm.nameAr}) إلى قسم "اكتشف أشهر الوجهات" بنجاح.`
        );
      }
      setShowDestinationModal(false);
      setEditingDestinationId(null);
      await loadAllAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionBusy(false);
    }
  };

  const handleToggleDestinationFeatured = async (dest) => {
    setActionBusy(true);
    try {
      const nextFeatured = !dest.is_featured;
      await adminApi.updateDestination(dest.id, {
        isFeatured: nextFeatured,
        status: nextFeatured ? 'active' : dest.status,
      });
      showToast(
        'success',
        nextFeatured
          ? `تم إظهار (${dest.name_ar}) في قسم "اكتشف أشهر الوجهات" بالصفحة الرئيسية.`
          : `تم إخفاء (${dest.name_ar}) من قسم "اكتشف أشهر الوجهات" بالصفحة الرئيسية.`
      );
      await loadAllAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionBusy(false);
    }
  };

  const handleDeleteDestination = async (dest) => {
    setActionBusy(true);
    try {
      const res = await adminApi.deleteDestination(dest.id);
      showToast('success', res.message || `تم حذف الوجهة (${dest.name_ar}) بنجاح.`);
      await loadAllAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionBusy(false);
    }
  };

  const handleToggleCatalogStatus = async (entityType, item) => {
    const nextStatus = item.status === 'active' ? 'archived' : 'active';
    setActionBusy(true);
    try {
      await adminApi.updateCatalogItemStatus(entityType, item.id, { status: nextStatus });
      showToast('success', `تم تحديث حالة (${item.name_ar}) إلى ${nextStatus}.`);
      await loadAllAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionBusy(false);
    }
  };

  const handleCreateFaq = async (e) => {
    e.preventDefault();
    setActionBusy(true);
    try {
      await adminApi.createFaqEntry(faqForm);
      showToast('success', 'تم نشر السؤال الشائع الجديد في مركز المساعدة.');
      setFaqForm({ category: 'GENERAL', question: '', answerMarkdown: '' });
      await loadAllAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setActionBusy(false);
    }
  };

  const handleExportReport = () => {
    const reportPayload = {
      generatedAt: new Date().toISOString(),
      platform: 'Travora Smart Tourism Platform',
      kpis: overview?.kpis,
      bookingsByKind: overview?.bookingsByKind,
    };
    const blob = new Blob([JSON.stringify(reportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'travora-platform-report.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'تم تصدير تقرير المنصة بنجاح.');
  };

  const kpis = overview?.kpis || {};
  const allDestinations = catalog?.destinations || [];
  const featuredCount = allDestinations.filter(
    (d) => d.status === 'active' && d.is_featured
  ).length;

  const filteredDestinations = allDestinations.filter((d) => {
    if (destFilter === 'featured' && !(d.status === 'active' && d.is_featured)) return false;
    if (destFilter === 'hidden' && d.status === 'active' && d.is_featured) return false;
    if (destSearch.trim()) {
      const q = destSearch.trim().toLowerCase();
      return (
        String(d.name_ar || '').toLowerCase().includes(q) ||
        String(d.name_en || '').toLowerCase().includes(q) ||
        String(d.tags_ar || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const catalogTabsMeta = buildCatalogTabsMeta(catalog, allDestinations.length, featuredCount);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#E6F4FF] via-[#F2F7FD] to-[#F8FAFC] text-[#0F172A] pb-12 font-['Cairo']"
    >
      <AdminHeader
        currentMeta={currentMeta}
        loading={loading}
        onOpenNewDestination={openNewDestinationModal}
        onOpenAllScreens={() => setShowAllScreensModal(true)}
        onOpenHelp={() => setShowHelpModal(true)}
      />

      {toast && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-3">
          <div
            className={`rounded-2xl px-4 py-2.5 text-xs font-extrabold flex items-center justify-between shadow-sm border ${
              toast.type === 'error'
                ? 'bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]'
                : 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
            }`}
          >
            <span>{toast.text}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-current opacity-70 hover:opacity-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-4 flex flex-col lg:flex-row items-start gap-4">
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          kpis={kpis}
          destinationsCount={allDestinations.length}
        />

        <main className="flex-1 w-full min-w-0 space-y-4">
          {activeTab === 'overview' && (
            <AdminOverviewTab
              overview={overview}
              kpis={kpis}
              allDestinations={allDestinations}
              featuredCount={featuredCount}
              onSelectTab={setActiveTab}
              onSelectCatalogSubTab={setCatalogSubTab}
              onOpenNewDestination={openNewDestinationModal}
              onRefresh={loadAllAdminData}
              onSelectApp={(app) => {
                setSelectedApp(app);
                setReviewNotes(app.decision_notes || '');
              }}
              onSelectDispute={(d) => {
                setSelectedDispute(d);
                setDisputeStatusNext(d.status);
                setDisputePriorityNext(d.priority);
                setDisputeReply('');
              }}
            />
          )}

          {activeTab === 'reports' && (
            <AdminReportsTab
              overview={overview}
              kpis={kpis}
              allDestinations={allDestinations}
              featuredCount={featuredCount}
              onExportReport={handleExportReport}
              onSelectTab={setActiveTab}
            />
          )}

          {activeTab === 'catalog' && (
            <AdminCatalogTab
              catalog={catalog}
              catalogTabsMeta={catalogTabsMeta}
              catalogSubTab={catalogSubTab}
              onSelectCatalogSubTab={setCatalogSubTab}
              allDestinations={allDestinations}
              featuredCount={featuredCount}
              filteredDestinations={filteredDestinations}
              destFilter={destFilter}
              onChangeDestFilter={setDestFilter}
              destSearch={destSearch}
              onChangeDestSearch={setDestSearch}
              actionBusy={actionBusy}
              onOpenNewDestination={openNewDestinationModal}
              onOpenEditDestination={openEditDestinationModal}
              onToggleDestinationFeatured={handleToggleDestinationFeatured}
              onToggleCatalogStatus={handleToggleCatalogStatus}
              onDeleteDestination={handleDeleteDestination}
            />
          )}

          {activeTab === 'audit' && (
            <AdminAuditTab
              auditLogs={auditLogs}
              auditSearch={auditSearch}
              onChangeAuditSearch={setAuditSearch}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettingsTab
              settingsData={settingsData}
              faqForm={faqForm}
              onChangeFaqForm={setFaqForm}
              actionBusy={actionBusy}
              onCreateFaq={handleCreateFaq}
            />
          )}

          {activeTab === 'providers' && (
            <AdminProvidersTab
              providers={providers}
              providerFilter={providerFilter}
              onChangeProviderFilter={setProviderFilter}
              actionBusy={actionBusy}
              onOpenNewProviderModal={() => setShowNewProviderModal(true)}
              onToggleProviderStatus={handleToggleProviderStatus}
            />
          )}

          {activeTab === 'applications' && (
            <AdminApplicationsTab
              applications={applications}
              appFilter={appFilter}
              onChangeAppFilter={setAppFilter}
              onSelectApp={(app) => {
                setSelectedApp(app);
                setReviewNotes(app.decision_notes || '');
              }}
            />
          )}

          {activeTab === 'users' && (
            <AdminUsersTab
              usersList={usersList}
              userFilter={userFilter}
              onChangeUserFilter={setUserFilter}
              actionBusy={actionBusy}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {activeTab === 'bookings' && (
            <AdminBookingsTab
              bookings={bookings}
              bookingFilter={bookingFilter}
              onChangeBookingFilter={setBookingFilter}
            />
          )}

          {activeTab === 'disputes' && (
            <AdminDisputesTab
              disputes={disputes}
              disputeFilter={disputeFilter}
              onChangeDisputeFilter={setDisputeFilter}
              onSelectDispute={(d) => {
                setSelectedDispute(d);
                setDisputeStatusNext(d.status);
                setDisputePriorityNext(d.priority);
                setDisputeReply('');
              }}
            />
          )}

          {activeTab === 'commissions' && (
            <AdminCommissionsTab
              finance={finance}
              onOpenNewCommissionModal={() => setShowCommissionModal(true)}
              onOpenEditCommissionModal={(rule) => {
                setCommissionForm({
                  bookingKind: rule.booking_kind,
                  name: `${rule.name.replace(/\(\d+.*?\)/, '').trim()} (محدثة)`,
                  ratePercent: String(rule.rate_bps / 100),
                  replaceRuleId: rule.id,
                });
                setShowCommissionModal(true);
              }}
              onToggleRule={handleToggleRule}
            />
          )}

          {activeTab === 'settlements' && (
            <AdminSettlementsTab
              finance={finance}
              actionBusy={actionBusy}
              onSettlementTransition={handleSettlementTransition}
              onCreatePayout={handleCreatePayout}
            />
          )}

          {activeTab === 'payouts' && (
            <AdminPayoutsTab
              finance={finance}
              actionBusy={actionBusy}
              onUpdatePayout={handleUpdatePayout}
            />
          )}
        </main>
      </div>

      <AllScreensModal
        open={showAllScreensModal}
        activeTab={activeTab}
        onClose={() => setShowAllScreensModal(false)}
        onSelectTab={setActiveTab}
      />

      <HelpModal open={showHelpModal} onClose={() => setShowHelpModal(false)} />

      <ApplicationReviewModal
        selectedApp={selectedApp}
        reviewNotes={reviewNotes}
        onChangeReviewNotes={setReviewNotes}
        actionBusy={actionBusy}
        onClose={() => setSelectedApp(null)}
        onReviewDecision={handleReviewApplication}
      />

      <NewProviderModal
        open={showNewProviderModal}
        form={newProviderForm}
        onChangeForm={setNewProviderForm}
        actionBusy={actionBusy}
        onClose={() => setShowNewProviderModal(false)}
        onSubmit={handleCreateProvider}
      />

      <DisputeResolutionModal
        selectedDispute={selectedDispute}
        disputeStatusNext={disputeStatusNext}
        onChangeDisputeStatus={setDisputeStatusNext}
        disputePriorityNext={disputePriorityNext}
        onChangeDisputePriority={setDisputePriorityNext}
        disputeReply={disputeReply}
        onChangeDisputeReply={setDisputeReply}
        actionBusy={actionBusy}
        onClose={() => setSelectedDispute(null)}
        onSubmit={handleUpdateDispute}
      />

      <CommissionRuleModal
        open={showCommissionModal}
        form={commissionForm}
        onChangeForm={setCommissionForm}
        actionBusy={actionBusy}
        onClose={() => setShowCommissionModal(false)}
        onSubmit={handleCreateCommissionRule}
      />

      <DestinationEditorModal
        open={showDestinationModal}
        editingDestinationId={editingDestinationId}
        form={destinationForm}
        onChangeForm={setDestinationForm}
        actionBusy={actionBusy}
        onClose={() => {
          setShowDestinationModal(false);
          setEditingDestinationId(null);
        }}
        onSubmit={handleSaveDestination}
      />
    </div>
  );
}
