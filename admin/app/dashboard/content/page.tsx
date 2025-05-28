"use client";

import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  LayoutDashboard, 
  FileEdit, 
  Image as ImageIcon, 
  Save, 
  PlusCircle, 
  Trash2, 
  MoveVertical,
  Loader2
} from 'lucide-react';

// Sample homepage sections data (would come from API in production)
const defaultHomepageSections = [
  {
    id: 'hero',
    title: 'Hero Banner',
    subtitle: 'Fresh Seafood Delivered to Your Doorstep',
    content: 'Discover the finest and freshest seafood, sourced directly from the coast of Tamil Nadu.',
    imageUrl: '/images/banners/hero-banner.jpg',
    ctaText: 'Shop Now',
    ctaLink: '/category/seafood',
    order: 1,
  },
  {
    id: 'featured',
    title: 'Featured Categories',
    subtitle: 'Explore Our Selection',
    content: 'Browse through our popular categories of fresh seafood.',
    imageUrl: '',
    ctaText: 'View All',
    ctaLink: '/categories',
    order: 2,
  },
  {
    id: 'bestsellers',
    title: 'Bestselling Products',
    subtitle: 'Customer Favorites',
    content: 'Our most popular seafood selections that customers love.',
    imageUrl: '/images/banners/bestsellers.jpg',
    ctaText: 'Shop Popular',
    ctaLink: '/products/featured',
    order: 3,
  }
];

// Sample about us content (would come from API in production)
const defaultAboutUsContent = {
  title: 'About Kadal Thunai',
  subtitle: 'Fresh from the Sea to Your Table',
  mainContent: `Kadal Thunai was founded in 2022 with a simple mission: to connect consumers with the freshest seafood directly from coastal Tamil Nadu.

Our founder, a third-generation fisherman, noticed that inland consumers rarely had access to truly fresh seafood. By establishing direct relationships with coastal fishing communities, we're able to deliver seafood that was swimming in the ocean just hours before reaching your doorstep.

We carefully select, clean, and package each product to ensure maximum freshness and quality. Our commitment to sustainability means we only source seafood that is harvested responsibly, protecting marine ecosystems for future generations.`,
  mission: 'To provide the freshest seafood while supporting coastal fishing communities and promoting sustainable fishing practices.',
  vision: 'To be the most trusted name in fresh seafood delivery across India.',
  teamMembers: [
    {
      id: '1',
      name: 'Raj Kumar',
      position: 'Founder & CEO',
      bio: 'Third-generation fisherman turned entrepreneur, passionate about connecting people with fresh seafood.',
      imageUrl: '/images/team/founder.jpg'
    },
    {
      id: '2',
      name: 'Priya Lakshmi',
      position: 'Head of Operations',
      bio: 'Expert in logistics and supply chain management with 10+ years of experience in food delivery.',
      imageUrl: '/images/team/operations.jpg'
    }
  ]
};

// Sample FAQ content (would come from API in production)
const defaultFaqItems = [
  {
    id: '1',
    question: 'How fresh is your seafood?',
    answer: 'Our seafood is delivered within 24-48 hours of being caught. We work directly with fishermen to ensure you get the freshest possible products.',
    order: 1,
  },
  {
    id: '2',
    question: 'Do you deliver to all areas in India?',
    answer: "Currently, we deliver to major cities in Tamil Nadu, Karnataka, and Andhra Pradesh. We're continually expanding our delivery zones.",
    order: 2,
  },
  {
    id: '3',
    question: 'How is the seafood packaged?',
    answer: 'We package our seafood in insulated boxes with ice packs to maintain optimal temperature. All packaging is eco-friendly and recyclable.',
    order: 3,
  },
  {
    id: '4',
    question: "What if I'm not satisfied with my order?",
    answer: "We have a 100% satisfaction guarantee. If you're not happy with your order, please contact us within 24 hours of delivery, and we'll make it right.",
    order: 4,
  }
];

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState("homepage");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Homepage content state
  const [homepageSections, setHomepageSections] = useState(defaultHomepageSections);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  
  // About us content state
  const [aboutUsContent, setAboutUsContent] = useState(defaultAboutUsContent);
  const [editingTeamMemberId, setEditingTeamMemberId] = useState<string | null>(null);
  
  // FAQ content state
  const [faqItems, setFaqItems] = useState(defaultFaqItems);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);

  const handleHomepageSectionChange = (id: string, field: string, value: string) => {
    setHomepageSections(prev => 
      prev.map(section => 
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const handleAboutUsChange = (field: string, value: string) => {
    setAboutUsContent(prev => ({ ...prev, [field]: value }));
  };

  const handleTeamMemberChange = (id: string, field: string, value: string) => {
    setAboutUsContent(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    }));
  };

  const handleFaqChange = (id: string, field: string, value: string) => {
    setFaqItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addNewHomepageSection = () => {
    const newId = `section-${Date.now()}`;
    const newOrder = homepageSections.length > 0 
      ? Math.max(...homepageSections.map(s => s.order)) + 1 
      : 1;
    
    const newSection = {
      id: newId,
      title: 'New Section',
      subtitle: 'Section Subtitle',
      content: 'Section content goes here.',
      imageUrl: '',
      ctaText: 'Learn More',
      ctaLink: '/',
      order: newOrder,
    };
    
    setHomepageSections([...homepageSections, newSection]);
    setEditingSectionId(newId);
  };

  const addNewTeamMember = () => {
    const newId = `team-${Date.now()}`;
    
    const newMember = {
      id: newId,
      name: 'New Team Member',
      position: 'Position',
      bio: 'Bio information',
      imageUrl: ''
    };
    
    setAboutUsContent(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, newMember]
    }));
    setEditingTeamMemberId(newId);
  };

  const addNewFaq = () => {
    const newId = `faq-${Date.now()}`;
    const newOrder = faqItems.length > 0 
      ? Math.max(...faqItems.map(item => item.order)) + 1 
      : 1;
    
    const newFaq = {
      id: newId,
      question: 'New Question',
      answer: 'Answer goes here',
      order: newOrder,
    };
    
    setFaqItems([...faqItems, newFaq]);
    setEditingFaqId(newId);
  };

  const removeHomepageSection = (id: string) => {
    if (confirm('Are you sure you want to remove this section?')) {
      setHomepageSections(prev => prev.filter(section => section.id !== id));
      if (editingSectionId === id) {
        setEditingSectionId(null);
      }
    }
  };

  const removeTeamMember = (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setAboutUsContent(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.filter(member => member.id !== id)
      }));
      if (editingTeamMemberId === id) {
        setEditingTeamMemberId(null);
      }
    }
  };

  const removeFaq = (id: string) => {
    if (confirm('Are you sure you want to remove this FAQ?')) {
      setFaqItems(prev => prev.filter(item => item.id !== id));
      if (editingFaqId === id) {
        setEditingFaqId(null);
      }
    }
  };

  const saveContent = async (contentType: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, you would send data to your API
      // const response = await fetch(`/api/content/${contentType}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(
      //     contentType === 'homepage' ? homepageSections :
      //     contentType === 'about' ? aboutUsContent :
      //     faqItems
      //   )
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Content Updated",
        description: `Your ${contentType} content has been saved successfully.`,
      });
      
      // Reset editing states
      if (contentType === 'homepage') setEditingSectionId(null);
      if (contentType === 'about') setEditingTeamMemberId(null);
      if (contentType === 'faq') setEditingFaqId(null);
      
    } catch (error) {
      toast({
        title: "Error Saving Content",
        description: `There was a problem saving your ${contentType} content.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const moveItem = (array: any[], setArray: Function, id: string, direction: 'up' | 'down') => {
    const index = array.findIndex(item => item.id === id);
    if ((index === 0 && direction === 'up') || (index === array.length - 1 && direction === 'down')) {
      return; // Can't move further
    }
    
    const newArray = [...array];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap items
    [newArray[index], newArray[targetIndex]] = [newArray[targetIndex], newArray[index]];
    
    // Update order properties
    newArray.forEach((item, idx) => {
      item.order = idx + 1;
    });
    
    setArray(newArray);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <DashboardHeader
        title="Content Management"
        description="Manage your website's content and pages."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="homepage" className="flex items-center gap-1">
            <LayoutDashboard size={16} /> Homepage
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-1">
            <FileEdit size={16} /> About Us
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-1">
            <FileEdit size={16} /> FAQ
          </TabsTrigger>
        </TabsList>

        {/* Homepage Content Tab */}
        <TabsContent value="homepage" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Homepage Sections</h3>
            <Button onClick={addNewHomepageSection}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Section
            </Button>
          </div>

          {homepageSections.map((section) => (
            <Card key={section.id} className={editingSectionId === section.id ? "border-2 border-blue-300" : ""}>
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <CardTitle className="text-base">{section.title}</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => moveItem(homepageSections, setHomepageSections, section.id, 'up')}
                    disabled={section.order === 1}
                  >
                    <MoveVertical size={16} className="rotate-180" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => moveItem(homepageSections, setHomepageSections, section.id, 'down')}
                    disabled={section.order === homepageSections.length}
                  >
                    <MoveVertical size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setEditingSectionId(editingSectionId === section.id ? null : section.id)}
                  >
                    <FileEdit size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700" 
                    onClick={() => removeHomepageSection(section.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardHeader>

              {editingSectionId === section.id && (
                <CardContent className="pt-0 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`title-${section.id}`} className="text-sm">Title</Label>
                      <Input 
                        id={`title-${section.id}`}
                        value={section.title} 
                        onChange={(e) => handleHomepageSectionChange(section.id, 'title', e.target.value)} 
                      />
                    </div>
                    <div>
                      <Label htmlFor={`subtitle-${section.id}`} className="text-sm">Subtitle</Label>
                      <Input 
                        id={`subtitle-${section.id}`}
                        value={section.subtitle}
                        onChange={(e) => handleHomepageSectionChange(section.id, 'subtitle', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor={`content-${section.id}`} className="text-sm">Content</Label>
                    <Textarea 
                      id={`content-${section.id}`}
                      value={section.content}
                      onChange={(e) => handleHomepageSectionChange(section.id, 'content', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="mt-4">
                    <Label htmlFor={`imageUrl-${section.id}`} className="text-sm">Image URL</Label>
                    <div className="flex gap-2">
                      <Input 
                        id={`imageUrl-${section.id}`}
                        value={section.imageUrl}
                        onChange={(e) => handleHomepageSectionChange(section.id, 'imageUrl', e.target.value)}
                      />
                      <Button variant="outline">
                        <ImageIcon size={16} className="mr-2" /> Browse
                      </Button>
                    </div>
                    {section.imageUrl && (
                      <div className="mt-2 w-24 h-24 relative">
                        <img 
                          src={section.imageUrl} 
                          alt={section.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor={`ctaText-${section.id}`} className="text-sm">CTA Button Text</Label>
                      <Input 
                        id={`ctaText-${section.id}`}
                        value={section.ctaText}
                        onChange={(e) => handleHomepageSectionChange(section.id, 'ctaText', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`ctaLink-${section.id}`} className="text-sm">CTA Button Link</Label>
                      <Input 
                        id={`ctaLink-${section.id}`}
                        value={section.ctaLink}
                        onChange={(e) => handleHomepageSectionChange(section.id, 'ctaLink', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          <div className="flex justify-end mt-6">
            <Button 
              onClick={() => saveContent('homepage')} 
              disabled={isLoading}
              className="w-40"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                <>
                  <Save size={16} className="mr-2" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* About Us Content Tab */}
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Us Page</CardTitle>
              <CardDescription>Manage your company's about us content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="about-title" className="text-sm">Page Title</Label>
                <Input 
                  id="about-title"
                  value={aboutUsContent.title}
                  onChange={(e) => handleAboutUsChange('title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="about-subtitle" className="text-sm">Subtitle</Label>
                <Input 
                  id="about-subtitle"
                  value={aboutUsContent.subtitle}
                  onChange={(e) => handleAboutUsChange('subtitle', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="about-content" className="text-sm">Main Content</Label>
                <Textarea 
                  id="about-content"
                  value={aboutUsContent.mainContent}
                  onChange={(e) => handleAboutUsChange('mainContent', e.target.value)}
                  rows={8}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="about-mission" className="text-sm">Mission Statement</Label>
                  <Textarea 
                    id="about-mission"
                    value={aboutUsContent.mission}
                    onChange={(e) => handleAboutUsChange('mission', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="about-vision" className="text-sm">Vision Statement</Label>
                  <Textarea 
                    id="about-vision"
                    value={aboutUsContent.vision}
                    onChange={(e) => handleAboutUsChange('vision', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center mt-6">
            <h3 className="text-lg font-medium">Team Members</h3>
            <Button onClick={addNewTeamMember}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Team Member
            </Button>
          </div>

          {aboutUsContent.teamMembers.map((member) => (
            <Card key={member.id} className={editingTeamMemberId === member.id ? "border-2 border-blue-300" : ""}>
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <CardTitle className="text-base">{member.name} - {member.position}</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setEditingTeamMemberId(editingTeamMemberId === member.id ? null : member.id)}
                  >
                    <FileEdit size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700" 
                    onClick={() => removeTeamMember(member.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardHeader>

              {editingTeamMemberId === member.id && (
                <CardContent className="pt-0 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`name-${member.id}`} className="text-sm">Name</Label>
                      <Input 
                        id={`name-${member.id}`}
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(member.id, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`position-${member.id}`} className="text-sm">Position</Label>
                      <Input 
                        id={`position-${member.id}`}
                        value={member.position}
                        onChange={(e) => handleTeamMemberChange(member.id, 'position', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor={`bio-${member.id}`} className="text-sm">Bio</Label>
                    <Textarea 
                      id={`bio-${member.id}`}
                      value={member.bio}
                      onChange={(e) => handleTeamMemberChange(member.id, 'bio', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="mt-4">
                    <Label htmlFor={`imageUrl-${member.id}`} className="text-sm">Profile Image URL</Label>
                    <div className="flex gap-2">
                      <Input 
                        id={`imageUrl-${member.id}`}
                        value={member.imageUrl}
                        onChange={(e) => handleTeamMemberChange(member.id, 'imageUrl', e.target.value)}
                      />
                      <Button variant="outline">
                        <ImageIcon size={16} className="mr-2" /> Browse
                      </Button>
                    </div>
                    {member.imageUrl && (
                      <div className="mt-2 w-24 h-24 relative rounded-full overflow-hidden">
                        <img 
                          src={member.imageUrl} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          <div className="flex justify-end mt-6">
            <Button 
              onClick={() => saveContent('about')} 
              disabled={isLoading}
              className="w-40"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                <>
                  <Save size={16} className="mr-2" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* FAQ Content Tab */}
        <TabsContent value="faq" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
            <Button onClick={addNewFaq}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New FAQ
            </Button>
          </div>

          {faqItems.map((faq) => (
            <Card key={faq.id} className={editingFaqId === faq.id ? "border-2 border-blue-300" : ""}>
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <CardTitle className="text-base">{faq.question}</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => moveItem(faqItems, setFaqItems, faq.id, 'up')}
                    disabled={faq.order === 1}
                  >
                    <MoveVertical size={16} className="rotate-180" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => moveItem(faqItems, setFaqItems, faq.id, 'down')}
                    disabled={faq.order === faqItems.length}
                  >
                    <MoveVertical size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setEditingFaqId(editingFaqId === faq.id ? null : faq.id)}
                  >
                    <FileEdit size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700" 
                    onClick={() => removeFaq(faq.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardHeader>

              {editingFaqId === faq.id && (
                <CardContent className="pt-0 border-t">
                  <div>
                    <Label htmlFor={`question-${faq.id}`} className="text-sm">Question</Label>
                    <Input 
                      id={`question-${faq.id}`}
                      value={faq.question}
                      onChange={(e) => handleFaqChange(faq.id, 'question', e.target.value)}
                    />
                  </div>

                  <div className="mt-4">
                    <Label htmlFor={`answer-${faq.id}`} className="text-sm">Answer</Label>
                    <Textarea 
                      id={`answer-${faq.id}`}
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(faq.id, 'answer', e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          <div className="flex justify-end mt-6">
            <Button 
              onClick={() => saveContent('faq')} 
              disabled={isLoading}
              className="w-40"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                <>
                  <Save size={16} className="mr-2" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}