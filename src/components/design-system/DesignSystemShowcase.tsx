import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Typography } from './RoadsideTypography';
import { RoadsideIcons } from './RoadsideIcons';
import { Motion } from './RoadsideMotion';
import { BrandKit } from './RoadsideBrandKit';

const DesignSystemShowcase = () => {
  const [selectedMotion, setSelectedMotion] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <BrandKit.Logo size="lg" />
            <BrandKit.Wordmark />
          </div>
          <Typography.Headline>S.O.S Design System</Typography.Headline>
          <Typography.Body className="max-w-2xl mx-auto">
            A cinematic brand kit balancing urgency and premium feel — from panic-proof usability to investor deck elegance.
          </Typography.Body>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="icons">Icons</TabsTrigger>
            <TabsTrigger value="motion">Motion</TabsTrigger>
            <TabsTrigger value="brand">Brand Kit</TabsTrigger>
          </TabsList>

          {/* Color Palette */}
          <TabsContent value="colors" className="space-y-6">
            <Card className="tech-surface p-6">
              <Typography.Subheadline className="mb-6">Core Brand Palette</Typography.Subheadline>
              <BrandKit.ColorPalette />
              
              <div className="mt-8 space-y-4">
                <Typography.Body>
                  <strong>Usage Guidelines:</strong>
                </Typography.Body>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><span className="w-3 h-3 bg-emergency-red rounded-full inline-block mr-2"></span>Emergency Red: Critical CTAs, alerts, SOS buttons</li>
                  <li><span className="w-3 h-3 bg-beacon-blue rounded-full inline-block mr-2"></span>Beacon Blue: Trust, active tracking, GPS navigation</li>
                  <li><span className="w-3 h-3 bg-pulse-green rounded-full inline-block mr-2"></span>Pulse Green: Verification, success states, safety confirmation</li>
                  <li><span className="w-3 h-3 bg-metallic-silver rounded-full inline-block mr-2"></span>Metallic Silver: Premium highlights, luxury details</li>
                </ul>
              </div>
            </Card>
          </TabsContent>

          {/* Typography */}
          <TabsContent value="typography" className="space-y-6">
            <Card className="tech-surface p-6">
              <Typography.Subheadline className="mb-6">Typography Scale</Typography.Subheadline>
              <BrandKit.TypographyScale />
              
              <div className="mt-8 p-4 bg-asphalt-gray rounded-lg">
                <Typography.Body>
                  <strong>Font System:</strong> Inter (Primary) — Clean, modern, high legibility for night mode and emergency situations.
                </Typography.Body>
              </div>
            </Card>
          </TabsContent>

          {/* Icons */}
          <TabsContent value="icons" className="space-y-6">
            <Card className="tech-surface p-6">
              <Typography.Subheadline className="mb-6">Animated Icon Library</Typography.Subheadline>
              <BrandKit.IconShowcase />
              
              <div className="mt-8 space-y-4">
                <Typography.Body>
                  <strong>Design Principles:</strong>
                </Typography.Body>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Flat design with glowing edge effects</li>
                  <li>• Subtle animations (pulse, glow, rotation)</li>
                  <li>• Consistent stroke width and corner radius</li>
                  <li>• Optimized for high contrast and accessibility</li>
                </ul>
              </div>
            </Card>
          </TabsContent>

          {/* Motion Library */}
          <TabsContent value="motion" className="space-y-6">
            <Card className="tech-surface p-6">
              <Typography.Subheadline className="mb-6">Cinematic Motion Library</Typography.Subheadline>
              
              <div className="space-y-8">
                <div>
                  <Typography.Body className="mb-4">Interactive Motion Examples:</Typography.Body>
                  <BrandKit.MotionShowcase />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Typography.Body><strong>Emergency Sequences:</strong></Typography.Body>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedMotion('sos')}
                        className="w-full"
                      >
                        SOS Ripple Effect
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedMotion('hazard')}
                        className="w-full"
                      >
                        Hazard Pulse
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Typography.Body><strong>Success States:</strong></Typography.Body>
                    <div className="space-y-2">
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedMotion('lock')}
                        className="w-full"
                      >
                        Provider Lock-In
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedMotion('completion')}
                        className="w-full"
                      >
                        Completion Glow
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Motion Demo Area */}
                <div className="h-32 bg-midnight-black rounded-lg flex items-center justify-center">
                  {selectedMotion === 'sos' && (
                    <Motion.SOSRipple className="w-16 h-16 rounded-full bg-emergency-red flex items-center justify-center">
                      <RoadsideIcons.Emergency size="md" />
                    </Motion.SOSRipple>
                  )}
                  {selectedMotion === 'hazard' && (
                    <Motion.HazardPulse>
                      <RoadsideIcons.Emergency size="lg" variant="emergency" />
                    </Motion.HazardPulse>
                  )}
                  {selectedMotion === 'lock' && (
                    <Motion.ProviderLock className="w-16 h-16 rounded-full bg-pulse-green/20 flex items-center justify-center">
                      <RoadsideIcons.Shield size="md" variant="success" />
                    </Motion.ProviderLock>
                  )}
                  {selectedMotion === 'completion' && (
                    <Motion.CompletionGlow>
                      <RoadsideIcons.Success size="lg" variant="success" />
                    </Motion.CompletionGlow>
                  )}
                  {!selectedMotion && (
                    <Typography.Small>Click a button above to see motion examples</Typography.Small>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Brand Kit */}
          <TabsContent value="brand" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="tech-surface p-6">
                <Typography.Subheadline className="mb-4">Logo Variations</Typography.Subheadline>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <BrandKit.Logo size="md" variant="default" />
                    <Typography.Small>Default</Typography.Small>
                  </div>
                  <div className="flex items-center space-x-4">
                    <BrandKit.Logo size="md" variant="monochrome" />
                    <Typography.Small>Monochrome</Typography.Small>
                  </div>
                  <div className="flex items-center space-x-4">
                    <BrandKit.Logo size="md" variant="emergency" />
                    <Typography.Small>Emergency</Typography.Small>
                  </div>
                </div>
              </Card>

              <Card className="tech-surface p-6">
                <Typography.Subheadline className="mb-4">Wordmark Styles</Typography.Subheadline>
                <div className="space-y-6">
                  <BrandKit.Wordmark variant="default" className="text-2xl" />
                  <BrandKit.Wordmark variant="emergency" className="text-2xl" />
                  <BrandKit.Wordmark variant="tech" className="text-2xl" />
                </div>
              </Card>
            </div>

            <Card className="tech-surface p-6">
              <Typography.Subheadline className="mb-4">Brand Applications</Typography.Subheadline>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Typography.Body><strong>Mobile App</strong></Typography.Body>
                  <Typography.Small>Dark theme optimized for night visibility</Typography.Small>
                </div>
                <div className="space-y-2">
                  <Typography.Body><strong>Marketing</strong></Typography.Body>
                  <Typography.Small>High contrast for billboards and digital ads</Typography.Small>
                </div>
                <div className="space-y-2">
                  <Typography.Body><strong>Corporate</strong></Typography.Body>
                  <Typography.Small>Premium finishes for investor materials</Typography.Small>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-border">
          <Typography.Caption>
            S.O.S Design System — Tesla OS meets Uber Black UI
          </Typography.Caption>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemShowcase;